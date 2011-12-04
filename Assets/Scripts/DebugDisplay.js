#pragma strict

var style : GUIStyle;

function OnGUI() {
    var text = "";

    text += WiiChuck.stick + "\n";
    text += WiiChuck.accFiltered + "\n";
    text += WiiChuck.buttons[0] + "/" + WiiChuck.buttons[1] + "\n";

    GUI.Label(Rect(0, 0, Screen.width, Screen.height), text, style);
}
