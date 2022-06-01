package com.jay.cv.project.controllers;

import com.jay.cv.project.configs.WebSocketConfigBroker;
import com.jay.cv.project.models.MultiPlayerGame.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.stream.IntStream;

@Controller
public class MultiPLayerController {
    public static List<Player> players = new ArrayList<>();


    // Handles messages from /app/chat. (Note the Spring adds the /app prefix for us).
    @MessageMapping("/chat")
    // Sends the return value of this method to /topic/messages
    @SendTo("/topic/messages")
    public List<Player> getMessages(Player player, SimpMessageHeaderAccessor headerAccessor) {
        Player player1;
        String sessionId = headerAccessor.getHeader("simpSessionId").toString();
        Optional<Player> doesPlayerExists = players.stream().filter(p -> Objects.equals(p.getSessionId(), sessionId)).findFirst();

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
            players.set(indexNum, p2);
        }
        return players;
    }

    // Sends the return value of this method to /topic/messages
    @SendTo("/topic/disconnect")
    public String getMessagesDisconnect(String disconnect) {
        return disconnect;
    }

}
