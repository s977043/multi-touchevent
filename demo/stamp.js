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
		/* サーバー側の実装まではコメントアウト
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
		//			detectHandler && detectHandler( true);

				});
		*/

		var s = "";
		for (var i = 0; i < touches.length; i++) {
			/*
			// デバック対応
			var t1 = touches;
			var t2 = t1;
			var t3 = t1;
			t2.pageX = t1[0].pageX + 10;
			t2.pageY = t1[0].pageY + 10.5;
			t3.pageX = t1[0].pageX + 20.5;
			t3.pageY = t1[0].pageY + 25.5;

<<<<<<< Updated upstream
for (var i = 0; i < 3 ; i++){
	if ( i== 0) {
		var t = t1;
	} else 	if ( i== 1) {
		var t = t2;
	}else {
		var t = t3;
	}
	*/
  var t = touches[i];
  s += "[" + t.identifier + "]";
  s += "x=" + t.pageX + ",";
  s += "y=" + t.pageY + "<br>";
}
=======
			for (var i = 0; i < 3 ; i++){
				if ( i== 0) {
					var t = t1;
				} else 	if ( i== 1) {
					var t = t2;
				}else {
					var t = t3;
				}
				*/
			var t = touches[i];
			s += "[" + t.identifier + "]";
			s += "x=" + t.pageX + ",";
			s += "y=" + t.pageY + "<br>";
		}
>>>>>>> Stashed changes

		var a = Math.sqrt(Math.pow(touches[1].pageX - touches[0].pageX, 2) + Math.pow(touches[1].pageY - touches[0].pageY, 2));
		var b = Math.sqrt(Math.pow(touches[2].pageX - touches[1].pageX, 2) + Math.pow(touches[2].pageY - touches[1].pageY, 2));
		var c = Math.sqrt(Math.pow(touches[0].pageX - touches[2].pageX, 2) + Math.pow(touches[0].pageY - touches[2].pageY, 2));
		//  var c = Math.sqrt( Math.pow( touches[3].pageX - touches[2].pageX , 2 ) + Math.pow( touches[3].pageY - touches[2].pageY, 2 ) ) ;
		//  var d = Math.sqrt( Math.pow( touches[0].pageX - touches[3].pageX , 2 ) + Math.pow( touches[0].pageY - touches[3].pageY, 2 ) ) ;

		var abc = a + b + c;

		s += "1→2の距離 ：" + a + "(" + a / abc + ") <br>";
		s += "2→3の距離：" + b + "(" + b / abc + ") <br>";
		s += "3→1の距離 ：" + c + "(" + c / abc + ") <br>";
		s += "1→2→3の距離：" + abc + "(" + abc / abc + ") <br>";
		//  s += "4-1 ：" + d + "<br>";

		document.getElementById("debug_area").innerHTML = s;

		detectHandler && detectHandler(true);
	};
})(window, jQuery, Spec);
