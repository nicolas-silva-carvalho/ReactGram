import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Player } from "@react-native-community/audio-toolkit"; // Biblioteca alternativa e robusta
import Icon from "react-native-vector-icons/FontAwesome";

// Supondo que você tenha uma função que chama seu backend
// Esta função retorna a URL do arquivo de áudio gerado
async function getAudioUrlFromText(text) {
  // A URL do seu endpoint de backend que gera o áudio
  const API_ENDPOINT = "https://sua-api.com/gerar-audio";
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
    return data.audioUrl; // Seu backend deve retornar um JSON como { audioUrl: '...' }
  } catch (error) {
    console.error("Erro ao buscar áudio da API:", error);
    return null;
  }
}

const SuggestionCard = ({ suggestionText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  const handleAudioPlayback = async () => {
    if (isPlaying && player) {
      player.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    const audioUrl = await getAudioUrlFromText(suggestionText);

    if (audioUrl) {
      const newPlayer = new Player(audioUrl, { autoDestroy: true }).prepare(
        (err) => {
          setIsLoading(false);
          if (err) {
            console.log("error a carregar player:", err);
            return;
          }

          newPlayer.play(() => {
            // Callback quando o som terminar
            setIsPlaying(false);
          });

          setIsPlaying(true);
          setPlayer(newPlayer);
        }
      );
    } else {
      setIsLoading(false);
      // Tratar erro: mostrar um alerta para o usuário
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{suggestionText}</Text>
      <TouchableOpacity
        onPress={handleAudioPlayback}
        style={styles.audioButton}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Icon
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={30}
            color="#007AFF"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
// ... (mesmos estilos do exemplo anterior)

// npm install react-native-tts
// npm install react-native-sound-player
