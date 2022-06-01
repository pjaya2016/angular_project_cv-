package com.jay.cv.project.controllers;

import com.jay.cv.project.configs.WebSocketConfigBroker;
import com.jay.cv.project.models.MultiPlayerGame.Player;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Objects;
import java.util.Set;

@Controller
public class MultiPLayerController {
    // Handles messages from /app/chat. (Note the Spring adds the /app prefix for us).
    @MessageMapping("/chat")
    // Sends the return value of this method to /topic/messages
    @SendTo("/topic/messages")
    public Player getMessages(Player player, SimpMessageHeaderAccessor headerAccessor) {
        player.setNumberOfUsersOnline(WebSocketConfigBroker.sessionIds);
        String sessionId = headerAccessor.getHeader("simpSessionId").toString();
        return player;
    }
}
