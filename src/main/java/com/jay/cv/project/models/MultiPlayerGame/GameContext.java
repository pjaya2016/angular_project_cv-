package com.jay.cv.project.models.MultiPlayerGame;

import java.util.List;

public class GameContext {
    private Player player;
    private List<Player> playerList;

    public GameContext(Player player, List<Player> playerList) {
        this.player = player;
        this.playerList = playerList;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public List<Player> getPlayerList() {
        return playerList;
    }

    public void setPlayerList(List<Player> playerList) {
        this.playerList = playerList;
    }
}
