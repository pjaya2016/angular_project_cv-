package com.jay.cv.project.models.MultiPlayerGame;


public class Player {
    private String userName;
    private Movement movement;
    private Rotation rotation;
    private String sessionId;
    private String keyPressed;
    private Double mixerUpdateDelta;

    public Rotation getRotation() {
        return rotation;
    }

    public void setRotation(Rotation rotation) {
        this.rotation = rotation;
    }

    public Double getMixerUpdateDelta() {
        return mixerUpdateDelta;
    }

    public void setMixerUpdateDelta(Double mixerUpdateDelta) {
        this.mixerUpdateDelta = mixerUpdateDelta;
    }

    public String getKeyPressed() {
        return keyPressed;
    }

    public void setKeyPressed(String keyPressed) {
        this.keyPressed = keyPressed;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Movement getMovement() {
        return movement;
    }

    public void setMovement(Movement movement) {
        this.movement = movement;
    }
}
