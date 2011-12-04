#pragma strict

function Awake() {
    WiiChuck.Install();
}

function Update() {
    transform.localScale = Vector3(1.0 + WiiChuck.stick[0] * 0.9, 1.0, 1.0 + WiiChuck.stick[1] * 0.9);
    transform.localRotation = Quaternion.FromToRotation(Vector3(0, -1, 0), WiiChuck.accFiltered);
    renderer.material.color = Color(1, WiiChuck.buttons[0] ? 0 : 1, WiiChuck.buttons[1] ? 0 : 1);
}
