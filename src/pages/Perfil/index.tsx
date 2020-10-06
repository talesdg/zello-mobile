import React, { useEffect, useRef, useState } from 'react';
import { IonAlert, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import './styles.css';
import api from '../../services/api';

interface PerfilProps{
  id: number;
  nome: string;
}
const Perfil: React.FC = () => {
  const inputNome = useRef<HTMLIonInputElement>(null);
  const [perfils, setPerfils] = useState<PerfilProps[]>([]);
  const [inputPerfil, setInputPerfil] = useState<number>();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertExcluido, setShowAlertExcluido] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  useEffect(()=>{
    api.get('/perfil').then((response)=>{setPerfils(response.data)})
  },[]);

  function resetInputs(){
    inputNome.current!.value= '';
  }
  async function handleSalve(){
    await api.post('/perfil',{
      nome:inputNome.current?.value,
    }).then(()=>{
      api.get('/perfil').then((response)=>{setPerfils(response.data)})
      setShowAlert(true);
      resetInputs();
    }).catch(()=>{
    });
  }
  async function handleExcluir(){
    await api.delete(`/perfil/${inputPerfil}`).then(()=>{
      api.get('/perfil').then((response)=>{setPerfils(response.data)})
      setShowAlertExcluido(true);
      resetInputs();
    }).catch(()=>{
      setShowAlertError(true);
    });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Cadastro de perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonLabel position="floating">Informe o nome do novo perfil</IonLabel>
          <IonInput ref={inputNome}  ></IonInput>
        </IonItem>
        <IonList>
          <IonItem>
            <IonLabel>Perfil</IonLabel>
            <IonSelect value={inputPerfil} interface="popover" placeholder="Selecione" onIonChange={e => setInputPerfil(e.detail.value)}>
            {perfils && perfils.map(perfil => (
               <IonSelectOption key={perfil.id} value={perfil.id}>{perfil.nome}</IonSelectOption>
            ))}
            </IonSelect>
          </IonItem>

        </IonList>
        <br />
        <IonButton className="button-salve-person" expand="block" onClick={handleSalve}>Salvar</IonButton>
        <IonToast
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        message="Registro salvo com sucesso"
        color="primary"
        duration={500}
      />
      <IonToast
        isOpen={showAlertExcluido}
        onDidDismiss={() => setShowAlertExcluido(false)}
        message="Registro excluido com sucesso"
        color="primary"
        duration={500}
      />
        <IonAlert
          isOpen={showAlertError}
          onDidDismiss={() => setShowAlertError(false)}
          cssClass='my-custom-class'
          header={'Alert'}
          subHeader={'Erro ao excluir o perfil'}
          message={'Existe pessoa com vínculo a este perfil'}
          buttons={['OK']}
        />
        <IonButton expand="block" color="danger" onClick={handleExcluir} >Excluir perfil selecionado</IonButton>
        
        
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
