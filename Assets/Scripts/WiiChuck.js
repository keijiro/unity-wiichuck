#pragma strict

import System.IO;

// デバイスファイルのパス
// 現状、手打ち指定。自動で探すべきだが……
static var devicePath = "/dev/cu.usbmodem621";

// 入力情報（外部から直接アクセスしてよい）
static var stick : Vector2;             // アナログスティック
static var acc : Vector3;               // 加速度ベクトル
static var accFiltered : Vector3;       // ローパスフィルタ適用済み加速度ベクトル
static var buttons = new boolean[2];    // Cボタン, Zボタン

// 唯一のインスタンス
private static var instance : WiiChuck;

// ドライバーのインストール
static function Install() {
    if (!instance) {
        // Update を呼ぶためにダミーのゲームオブジェクトに据え付ける。
        var master = new GameObject("WiiChuckDriver");
        instance = master.AddComponent.<WiiChuck>();
        DontDestroyOnLoad(master);
    }
}

// 以下プライベート部

private var stream : StreamReader;
private var buffer : String;
private var lastLine : String;

function Start() {
    stream = new StreamReader(devicePath);
}

function Update() {
    // 一時バッファへの読み込み。
    var temp = new char[1024];
    var count = stream.Read(temp, 0, temp.Length);
    if (count == 0) return;
    // バッファへ付け足し。
    buffer = buffer + (new String(temp, 0, count));
    // ライン毎に削っていって、最後のラインとその一つ前のラインだけ抽出する。
    var reader = new StringReader(buffer);
    var prevLine : String;
    while (true) {
        var line = reader.ReadLine();
        if (line == null) break;
        if (prevLine) lastLine = prevLine;
        prevLine = line;
    }
    // 最後のラインだけバッファに残す。
    buffer = prevLine;
    // 最後から一つ前のラインを読み取って更新する。
    ReadLastLine();
    // 加速度ベクトルのローパスフィルタ適用。
    accFiltered = Vector3.Lerp(accFiltered, acc, 0.333);
}

private function ReadLastLine() {
    // ラインの始まりと終わりを確認。
    if (!lastLine.StartsWith("^") || !lastLine.EndsWith("$")) return;
    // 始まりと終わりを取り除く。
    var temp = lastLine;
    temp = temp.Remove(0, 1);
    temp = temp.Remove(temp.IndexOf("$"));
    // カンマで分割。
    var vals = temp.Split(","[0]);
    // 各要素を読み取る。
    stick = (Vector2(int.Parse(vals[0]), int.Parse(vals[1])) - Vector2(128, 128)) * (1.0 / 100);
    acc = (Vector3(int.Parse(vals[2]), -int.Parse(vals[4]), int.Parse(vals[3])) - Vector3(128, -128, 128)) * (1.0 / 64);
    buttons[0] = (int.Parse(vals[5]) != 0);
    buttons[1] = (int.Parse(vals[6]) != 0);
}
