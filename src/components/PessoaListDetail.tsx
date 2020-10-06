import React from 'react';

import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from '@ionic/react';


interface PessoaProps{
  nome: string;
  cpf: string;
}

const PessoaListDetail: React.FC<PessoaProps> = ({ nome, cpf }) => {

  return (
    <>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/pessoa/list"></IonBackButton>
          </IonButtons>
          <IonTitle>{nome}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <p>{cpf}</p>
      </IonContent>
    </>
  );
};

export default PessoaListDetail