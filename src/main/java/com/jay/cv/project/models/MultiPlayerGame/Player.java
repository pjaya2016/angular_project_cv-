package com.jay.cv.project.models.MultiPlayerGame;


import com.jay.cv.project.configs.WebSocketConfigBroker;

import java.util.ArrayList;
import java.util.List;

public class Player {
    private String userName;
    private Movement movement;
    private String sessionId;

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
