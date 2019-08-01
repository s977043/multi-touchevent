'use strict';

(function (global, $, Spec) {
	if (!$) throw new Error('jQuery  が読み込まれていません');

	Array.from = undefined;
	Array.from = Array.from || function (arraylike) {
		var a = [];
		for (var i = 0; i < arraylike.length; i++) {
			a[i] = arraylike[i];
		}
		return a;
	};

	///=====================================================================================================================
	/// @brief 　Dstamp クラス
	///
	/// @param  options             {Object}                (required) 初期化オプション
	///             .uri            {String}                (required) 認識サーバのURI
	///             .timeout        {Int}                   (optional) 認識のタイムアウト値[ミリ秒](デフォルト　3000)
	///             .hint           {String}                (optional) 環境推定ヒント(デフォルト 'standard/ A')
	///             .pointNum       {Int}                   (optional) 導電点の数(省略した場合は検出端子数のチェックをしない)
	///             .spec           {Spec}                  (optional) Spec.js のインスタンス
	///=====================================================================================================================
	global.Dstamp = function Dstamp(options) {
		this._uri = options.uri + '';
		this._timeout = options.timeout - 0 || 3000;
		this._hint = options.hint || 'standard/A';
		this._pointNum = options.pointNum - 0;
		this._spec = options.spec || new Spec();
//		this._ua = new UserAgent(); // iPhone 6
//		this._spec = options.spec || new Spec(ua);
	};

	///=====================================================================================================================
	/// @brief  サーバにタッチ情報のリクエストを投げる
	///
	/// @param  event               {TouchEvent}            (required) タッチイベント
	/// @param  detectHandler       {function(Block)}       (optional) スタンプ認識イベントハンドラー
	/// @param  nonDetectHandler    {function(String)}      (optional) 不認識イベントハンドラー
	/// @param  errorHandler        {function(Int,String)}  (optional) 通信エラーイベントハンドラー
	///=====================================================================================================================
	Dstamp.prototype.postQuery = function (event, detectHandler, nonDetectHandler, errorHandler) {
		var touches = (event.originalEvent || event).touches;

		if (this._pointNum && this._pointNum !== touches.length) {
			return;
		}

		//	サーバに送信する情報
		var query = {
			touches: Array.from(touches).map(function (t) {
				return { x: t.pageX, y: t.pageY };
			}),
			orientation: global.orientation,
			device: this._spec.DEVICE,
			displayDpr: this._spec.DISPLAY_DPR,
			displayInch: this._spec.DISPLAY_INCH,
			displayLong: this._spec.DISPLAY_LONG,
			displayShort: this._spec.DISPLAY_SHORT,
			estimationHint: this._hint + ''
		};

		console.log(query);

		//	サーバに送信
		$.ajax(this._uri, {
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(query),
			dataType: 'json',
			timeout: this._timeout
		}).then(function (json) {
			//	通信に成功
			if (json.block) {
				//	認識に成功
				detectHandler && detectHandler(json.block);
			} else {
				//	認識に失敗
				nonDetectHandler && nonDetectHandler(json.error);
			}
		}, function (jqxhr, status, error) {
			//	通信に失敗
			errorHandler && errorHandler(status, error);
		});
	};
})(window, jQuery);
