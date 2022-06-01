package com.jay.cv.project.models.MultiPlayerGame;


import com.jay.cv.project.configs.WebSocketConfigBroker;

import java.util.ArrayList;
import java.util.List;

public class Player {
    private String userName;
    private Movement movement;
    private List<String> numberOfUsersOnline = new ArrayList<>();

    public List<String> getNumberOfUsersOnline() {
        return numberOfUsersOnline;
    }

    public void setNumberOfUsersOnline(List<String> numberOfUsersOnline) {
        this.numberOfUsersOnline = numberOfUsersOnline;
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
