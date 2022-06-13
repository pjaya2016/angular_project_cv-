package com.jay.cv.project.controllers;

import com.jay.cv.project.models.MultiPlayerGame.GameContext;
import com.jay.cv.project.models.MultiPlayerGame.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

@Controller
public class MultiPLayerController {
    public static List<Player> players = new ArrayList<>();


    // Handles messages from /app/chat. (Note the Spring adds the /app prefix for us).
    @MessageMapping("/chat")
    // Sends the return value of this method to /topic/messages
    @SendTo("/topic/messages")
    public GameContext getMessages(Player player, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getHeader("simpSessionId").toString();

        int indexNum = IntStream.range(0, players.size())
                .filter(i -> sessionId.equals(players.get(i).getSessionId()))
                .findFirst()
                .orElse(-1);

            if (indexNum == -1) {
                player.setSessionId(sessionId);
                players.add(player);
            } else {
                Player p2 = players.get(indexNum);
                p2.setMovement(player.getMovement());
                p2.setRotation(player.getRotation());
                p2.setMixerUpdateDelta(player.getMixerUpdateDelta());
                p2.setKeyPressed(player.getKeyPressed());
                players.set(indexNum, p2);
            }
        GameContext gameContext = new GameContext(player, players);
        return gameContext;
    }

    // Sends the return value of this method to /topic/messages
    @SendTo("/topic/disconnect")
    public String getMessagesDisconnect(String disconnect) {
        return disconnect;
    }

}
