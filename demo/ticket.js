'use strict';

window.addEventListener('load', function () {
	// 読み込み中のアニメーションを終了
	document.querySelector('.loading').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function () {
	// タッチ開始時の処理
	document.addEventListener('touchstart', function onTouchStart(event) {
		if (event.touches.length !== 3) return false;

		// ブロックの認識を開始する
		// エラーメッセージを一旦非表示に
		var stamp = document.querySelector('.stamp_p');
		var error = document.querySelector('.error-message');

		// 画面を暗くする
		var blackout = document.querySelector('.overlay-black');

		blackout.style.display = 'block';

		error.style.display = 'none';

		try {
			new Dstamp({ uri: 'ticketServlet' }).postQuery(event, function (block) {
				// ブロックの認識が成功した
				// 白く明滅
				var whiteout = document.querySelector('.overlay-white');

				blackout.style.display = 'none';
				whiteout.style.display = 'block';

				// ブロックを表示する

				stamp.style.display = 'block';
				//				stamp.style.left = block.centerX + 'px';
				//				stamp.style.top = block.centerY + 'px';
				//				stamp.style.transform = stamp.style.webkitTransform = 'translate(-50%, -50%) rotate(' + block.rotation + 'rad)';

				// タッチイベントを取り除く
				document.removeEventListener('touchstart', onTouchStart);
			}, function () {
				// エラーを表示
				blackout.style.display = 'none';

				if (stamp.style.display !== 'block') {
					error.style.display = 'block';
				}
			}, function () {
				// エラーを表示
				blackout.style.display = 'none';

				if (stamp.style.display !== 'block') {
					error.style.display = 'block';
				}
			});
		} catch (e) {
			// エラーを表示
			blackout.style.display = 'none';

			if (stamp.style.display !== 'block') {
				error.style.display = 'block';
			}
			console.log(e.message);
		}
	}, false);

	// デフォルトのタッチイベントを無効化する
	document.addEventListener('touchstart', function (e) {
		return e.preventDefault();
	}, false);
}, false);
