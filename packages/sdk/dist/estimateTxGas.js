"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.estimateGasCosts = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

var _utils = require("./utils");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var baseGasValue = function baseGasValue(hexValue) {
  switch (hexValue) {
    case '0x':
      return 0;

    case '00':
      return 4;

    default:
      return 68;
  }
};

var estimateBaseGasCosts = function estimateBaseGasCosts(dataString) {
  var reducer = function reducer(accumulator, currentValue) {
    return accumulator += baseGasValue(currentValue);
  };

  return dataString.match(/.{2}/g).reduce(reducer, 0);
};

var estimateBaseGas = function estimateBaseGas(_ref) {
  var safe = _ref.safe,
      to = _ref.to,
      value = _ref.value,
      data = _ref.data,
      operation = _ref.operation,
      txGasEstimate = _ref.txGasEstimate,
      gasPrice = _ref.gasPrice,
      gasToken = _ref.gasToken,
      refundReceiver = _ref.refundReceiver,
      signatureCount = _ref.signatureCount,
      nonce = _ref.nonce;
  // numbers < 256 are 192 -> 31 * 4 + 68
  // numbers < 65k are 256 -> 30 * 4 + 2 * 68
  // For signature array length and baseGasEstimate we already calculated the 0 bytes so we just add 64 for each non-zero byte
  var signatureCost = signatureCount * (68 + 2176 + 2176 + 6000); // (array count (3 -> r, s, v) + ecrecover costs) * signature count

  var payload = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'execTransaction', [to, value, data, operation, txGasEstimate, 0, // base gas
  gasPrice, gasToken, refundReceiver, '0x' // signature
  ]);
  var baseGasEstimate = estimateBaseGasCosts(payload) + signatureCost + (nonce > 0 ? 5000 : 20000) + 1500; // 1500 -> hash generation costs

  return baseGasEstimate + 32000; // Add aditional gas costs (e.g. base tx costs, transfer costs)
};

var estimateGasCosts =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref2) {
    var jsonRpcUrl, safe, to, value, data, operation, gasToken, refundReceiver, _ref2$signatureCount, signatureCount, provider, gnosisSafe, nonce, currentGasPriceGwei, estimateData, estimateResponse, txGasEstimate, gasCosts, gasPriceGwei, gasPrice, baseGasEstimate;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref2.jsonRpcUrl, safe = _ref2.safe, to = _ref2.to, value = _ref2.value, data = _ref2.data, operation = _ref2.operation, gasToken = _ref2.gasToken, refundReceiver = _ref2.refundReceiver, _ref2$signatureCount = _ref2.signatureCount, signatureCount = _ref2$signatureCount === void 0 ? 1 : _ref2$signatureCount;
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            gnosisSafe = new _ethers.ethers.Contract(safe, _GnosisSafe["default"].abi, provider);
            _context.next = 5;
            return gnosisSafe.nonce();

          case 5:
            nonce = _context.sent;
            _context.next = 8;
            return provider.getGasPrice();

          case 8:
            currentGasPriceGwei = _context.sent;
            currentGasPriceGwei = _ethers.ethers.utils.formatUnits(currentGasPriceGwei.toString(), 'gwei');
            currentGasPriceGwei = parseInt(Math.ceil(currentGasPriceGwei));
            estimateData = (0, _utils.encodeParams)(_GnosisSafe["default"].abi, 'requiredTxGas', [to, value, data, operation]);
            _context.next = 14;
            return provider.call({
              from: safe,
              to: safe,
              value: value,
              data: estimateData,
              gasPrice: 0
            });

          case 14:
            estimateResponse = _context.sent;
            txGasEstimate = new _bignumber["default"](estimateResponse.substring(138), 16); // Add 10k else we will fail in case of nested calls

            txGasEstimate = txGasEstimate.toNumber() + 100000;
            gasCosts = [];
            gasCosts.push({
              gasPrice: 0,
              baseGas: estimateBaseGas({
                safe: safe,
                to: to,
                value: value,
                data: data,
                operation: operation,
                txGasEstimate: txGasEstimate,
                gasToken: gasToken,
                gasPrice: '0',
                refundReceiver: refundReceiver,
                signatureCount: signatureCount,
                nonce: nonce
              }),
              safeTxGas: txGasEstimate
            });

            for (gasPriceGwei = currentGasPriceGwei; gasPriceGwei <= currentGasPriceGwei + 5; gasPriceGwei++) {
              gasPrice = _ethers.ethers.utils.parseUnits(gasPriceGwei.toString(), 'gwei').toNumber();
              baseGasEstimate = estimateBaseGas({
                safe: safe,
                to: to,
                value: value,
                data: data,
                operation: operation,
                txGasEstimate: txGasEstimate,
                gasToken: gasToken,
                gasPrice: gasPrice,
                refundReceiver: refundReceiver,
                signatureCount: signatureCount,
                nonce: nonce
              });
              gasCosts.push({
                gasPrice: gasPrice,
                baseGas: baseGasEstimate,
                safeTxGas: txGasEstimate
              });
            }

            return _context.abrupt("return", gasCosts);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function estimateGasCosts(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.estimateGasCosts = estimateGasCosts;