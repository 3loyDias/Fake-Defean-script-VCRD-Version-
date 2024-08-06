// ==UserScript==
// @name         Fake Mute&Deafen for Vencord
// @version      0.0.1
// @description  Plugin for Vencord to fake mute and deafen in voice channels.
// @author       Your Name
// @match        https://discord.com/*
// ==/UserScript==

(function() {
    const pluginName = "Fake Mute&Deafen";
    
    // Function to start the plugin
    function start() {
        console.log(`${pluginName} started`);

        const originalSend = WebSocket.prototype.send;

        WebSocket.prototype.send = function(data) {
            if (data instanceof ArrayBuffer) {
                const text = new TextDecoder("utf-8").decode(data);
                if (text.includes('"self_deaf"')) {
                    console.log(`${pluginName}: Intercepted mute/deafen message`);
                    const modifiedText = text.replace('"self_mute":false', 'NiceOneDiscord');
                    data = new TextEncoder().encode(modifiedText);
                    console.log(`${pluginName}: Modified message sent`);
                }
            }
            originalSend.apply(this, [data]);
        };

        alert(`${pluginName}: Plugin activated. Please note, you must reload Discord to reset any changes.`);
    }

    // Function to stop the plugin
    function stop() {
        console.log(`${pluginName} stopped`);
        WebSocket.prototype.send = WebSocket.prototype.originalSend;
    }

    // Automatically start the plugin when Vencord loads
    if (typeof window.Vencord !== 'undefined') {
        start();
        Vencord.Plugins.registerPlugin({
            name: pluginName,
            description: 'Join voice channel, mute and deafen yourself, start and stop plugin, now you can Un-mute and Listen and speak!',
            version: '0.0.1',
            author: 'Your Name',
            start,
            stop
        });
    } else {
        console.error(`${pluginName}: Vencord is not available.`);
    }
})();
