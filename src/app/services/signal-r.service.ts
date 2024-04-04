import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export
 class SignalRService {
  public hubConnection!: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7042/viewCountHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  public addViewCountListener = (UpdateViewCount: (id: number, viewCount: number) => void) => {
    this.hubConnection.on('ReceiveViewCount', (doctorId: number, viewCount: number) => {
      UpdateViewCount(doctorId, viewCount);
    });
  };
}
