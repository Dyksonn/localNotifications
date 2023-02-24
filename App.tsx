import { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';
import notifee, { AndroidImportance, EventType, TimestampTrigger, TriggerType } from "@notifee/react-native";

import { styles } from './styles';

export default function App() {

  async function createChannelId() {
    const channelId = await notifee.createChannel({
      id: 'test',
      name: 'sales',
      vibration: true,
      importance: AndroidImportance.HIGH
    });

    return channelId;
  }

  async function displayNotification() {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: '7',
      title: 'Olá, Dykson',
      body: 'Primeira notificação',
      android: { channelId }
    });
  }

  // TODO: UPDATE

  async function cancellNotification() {
    await notifee.cancelNotification('7');
  }

  async function scheduleNotification() {
    const date = new Date(Date.now());
    date.setMinutes(date.getMinutes() + 1);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    } 

    const channelId = await createChannelId();

    await notifee.createTriggerNotification({
      title: 'Notificação agendada!',
      body: 'Essa é uma notificação agendada!',
      android: {channelId }
    }, trigger);
  }

  async function listScheduleNotifications() {
    notifee.getTriggerNotificationIds().then(ids => console.log(ids));
  }

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("Usuário descartou a notificação");
          break;
        case EventType.ACTION_PRESS:
          console.log("Usuário tocou na notificação", detail.notification);
          break;
      }
    })
  }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("Usuário tocou na notificação.", detail.notification);
      }
    })
  }, []);

  return (
    <View style={styles.container}>
      <Text>Local Notifications</Text>

      <Button 
        title="Enviar Notificação"
        onPress={displayNotification}
      />

      <StatusBar style="auto" />
    </View>
  );
}


