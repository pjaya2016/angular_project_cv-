package com.jay.cv.project.utils;

import com.jay.cv.project.controllers.MultiPLayerController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
@Component
public class StompEventListener implements ApplicationListener<SessionConnectEvent> {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @Override
    public void onApplicationEvent(SessionConnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        boolean isConnect = sha.getCommand() == StompCommand.CONNECT;
        boolean isDisconnect = sha.getCommand() == StompCommand.DISCONNECT;
    }

    @EventListener
    public void onSocketConnected(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
    }

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        MultiPLayerController.players.removeIf(p -> p.getSessionId().equals(event.getSessionId()));
        simpMessagingTemplate.convertAndSend("/topic/disconnect",event.getSessionId());
    }
}
