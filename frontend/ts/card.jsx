import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Tts from "react-native-tts";
import Icon from "react-native-vector-icons/FontAwesome"; // Exemplo de biblioteca de ícones

const SuggestionCard = ({ suggestionText }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Configura os eventos do TTS
  useEffect(() => {
    // Quando a fala começa
    Tts.addEventListener("tts-start", () => setIsPlaying(true));
    // Quando a fala termina
    Tts.addEventListener("tts-finish", () => setIsPlaying(false));
    // Em caso de erro
    Tts.addEventListener("tts-error", (error) => {
      console.error("Erro no TTS:", error);
      setIsPlaying(false);
    });
    // Em caso de cancelamento
    Tts.addEventListener("tts-cancel", () => setIsPlaying(false));

    // Configura a voz (opcional)
    Tts.setDefaultLanguage("pt-BR");

    // Limpa os listeners ao desmontar o componente
    return () => {
      Tts.stop(); // Garante que o som pare ao sair da tela
      Tts.removeEventListener("tts-start", () => {});
      Tts.removeEventListener("tts-finish", () => {});
      Tts.removeEventListener("tts-error", () => {});
      Tts.removeEventListener("tts-cancel", () => {});
    };
  }, []);

  const handleAudioPlayback = () => {
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
    } else {
      Tts.speak(suggestionText);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.text}>{suggestionText}</Text>
      <TouchableOpacity
        onPress={handleAudioPlayback}
        style={styles.audioButton}
      >
        <Icon
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={30}
          color="#007AFF"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: "relative", // Para o botão de áudio
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10, // Espaço para o botão não ficar colado
  },
  audioButton: {
    alignSelf: "flex-end", // Alinha o botão à direita
  },
});

export default SuggestionCard;
