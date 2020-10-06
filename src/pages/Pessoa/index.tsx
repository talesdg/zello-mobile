import React, { useEffect, useRef, useState } from 'react';
import { IonAlert, IonButton, IonCard, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import './styles.css';
import api from '../../services/api';

interface PerfilProps{
  id: number;
  nome: string;
}
const Pessoa: React.FC = () => {
  const inputNome = useRef<HTMLIonInputElement>(null);
  const inputCPF = useRef<HTMLIonInputElement>(null);
  const inputRG = useRef<HTMLIonInputElement>(null);
  const inputDtNasc = useRef<HTMLIonDatetimeElement>(null);
  const [inputPerfil, setInputPerfil] = useState<number>();
  const [perfils, setPerfils] = useState<PerfilProps[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  useEffect(()=>{
    api.get('/perfil').then((response)=>{setPerfils(response.data)})
  },[]);

  function resetInputs(){
    inputNome.current!.value= '';
    inputCPF.current!.value= '';
    inputRG.current!.value= '';
    inputDtNasc.current!.value= '';
  }
  async function handleSalve(){
    await api.post('/pessoa',{
      nome:inputNome.current?.value,
      cpf:inputCPF.current?.value,
      rg:inputRG.current?.value,
      dt_nascimento: inputDtNasc.current?.value,
      perfil_id: inputPerfil
    }).then(()=>{
      setShowAlert(true);
      resetInputs();
    }).catch(()=>{
      setShowAlertError(true);
    });
    
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de pessoa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Cadastro de pessoa</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
        <IonItem>
          <IonLabel position="floating">NOME</IonLabel>
          <IonInput ref={inputNome}  ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">CPF</IonLabel>
          <IonInput ref={inputCPF}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">RG</IonLabel>
          <IonInput ref={inputRG}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Data de Nascimento</IonLabel>
          <IonDatetime ref={inputDtNasc} displayFormat="DD/MM/YYYY" min="1900-01-11" max="2020-10-10" ></IonDatetime>
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
        </IonCard>
        <br />
        <IonButton className="button-salve-person" expand="block" onClick={handleSalve}>Salvar</IonButton>
        <IonToast
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        message="Registro salvo com sucesso"
        color="primary"
        duration={500}
      />
        <IonAlert
          isOpen={showAlertError}
          onDidDismiss={() => setShowAlertError(false)}
          cssClass='my-custom-class'
          header={'Alert'}
          subHeader={'Erro ao salvar a pessoa'}
          message={'Nome e CPF são obrigatórios ou CPF inválido'}
          buttons={['OK']}
        />
        <IonButton className="button-list-person" expand="block" color="secondary"  href="/pessoa/list">Listar pessoas</IonButton>
        
        
      </IonContent>
    </IonPage>
  );
};

export default Pessoa;
