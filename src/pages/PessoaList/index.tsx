import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonIcon, IonLabel, IonItemOption, IonItemOptions, IonItemSliding, IonNote, IonButton, IonModal, IonInput, IonSelect, IonSelectOption, IonAlert, IonToast } from '@ionic/react';

import React, { useEffect, useRef, useState } from 'react';
import IonReactNav from '../../components/IonReactNav';
import TechDetail from '../../components/PessoaListDetail';
import { IonReactRouter } from '@ionic/react-router';
import api from '../../services/api';
import { trash, pencil } from 'ionicons/icons';
import cpfMask from '../../utils/cpfMask';
import './styles.css';
interface PessoaProps{
  id: string;
  nome: string;
  cpf: string;
  cpf_formatado: string;
  dt_nascimento: string;
  dt_nasc_formatted:string | undefined;
  rg: string;
  perfil_id: string;
}
interface PerfilProps{
  id: number;
  nome: string;
}
const Home: React.FC = () => {
  
  const inputNome = useRef<HTMLIonInputElement>(null);
  const inputCPF = useRef<HTMLIonInputElement>(null);
  const inputRG = useRef<HTMLIonInputElement>(null);
  const inputDtNasc = useRef<HTMLIonInputElement>(null);
  const [inputPerfil, setInputPerfil] = useState<number>();
  const [perfils, setPerfils] = useState<PerfilProps[]>([]);
  const [pessoas, setPessoas] = useState<PessoaProps[]>([]);
  const [pessoaEdit, setPessoaEdit] = useState<PessoaProps>();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertExcluido, setShowAlertExcluido] = useState(false);
  const [showAlertErrorCPF, setShowAlertErrorCPF] = useState(false);
  const [showAlertErrorDate, setShowAlertErrorDate] = useState(false);
  const [showAlertErrorExcluido, setShowAlertErrorExcluido] = useState(false);

  useEffect(()=>{
    api.get<PessoaProps[]>('/pessoa').then((response)=>{
      const responseFormatted = response.data.map(response=>{
        let dtFormat;
        if(response.dt_nascimento !== null ) {
          const [ year, month, day ] = response.dt_nascimento.substr(0, 10).split('-')
          dtFormat=`${day}/${month}/${year}`;
        }
        return{
          ...response,
          cpf_formatado: cpfMask(response.cpf),
          dt_nasc_formatted: dtFormat,
        }
      })
      setPessoas(responseFormatted)
    })
  },[]);
  
  const [pessoa, setPessoa] = useState(pessoas[0]);
  
  async function handleTrash(id:string){
    await api.delete(`/pessoa/${id}`).then(()=>{
      setShowAlertExcluido(true);
    }).catch((response)=>{
      setShowAlertErrorExcluido(true);
    });
  }
  
  const [showModal, setShowModal] = useState(false);
  useEffect(()=>{
    api.get('/perfil').then((response)=>{setPerfils(response.data)})
  },[]);
  async function handleEdit(id:string){
    await api.get<PessoaProps>(`/pessoa/${id}`).then((response)=>{
      const {dt_nascimento,perfil_id} = response.data;  
      let dt_formatted;
        if(dt_nascimento !== null ) {
          const [ year, month, day ] = dt_nascimento.substr(0, 10).split('-')
          dt_formatted=`${day}/${month}/${year}`;
        }
        setInputPerfil(Number(perfil_id));
        setPessoaEdit({...response.data,dt_nasc_formatted: dt_formatted});
        setShowModal(true);
      });
  }
  function resetInputs(){
    inputNome.current!.value= '';
    inputCPF.current!.value= '';
    inputRG.current!.value= '';
    inputDtNasc.current!.value= '';
  }
  async function handleUpdate(id:string){
    let dateFormated;
    let cpfFormated;
    try{
      let date = inputDtNasc.current?.value?.toString();
      if(date){
        const [day,month,year] = date.split('/');
        dateFormated = new Date(Number(year),Number(month),Number(day))
        if(year.length<4){
          setShowAlertErrorDate(true);
        }
      }
      let cpf = inputCPF.current?.value;
      if(cpf){
        cpfFormated = cpf.toString().replace('.','').replace('.','').replace('-','');
      }
    await api.put(`/pessoa/${id}`,{
      nome:inputNome.current?.value,
      cpf:cpfFormated,
      rg:inputRG.current?.value,
      dt_nascimento: dateFormated,
      perfil_id: inputPerfil
    }).then(()=>{
      setShowAlert(true);
      resetInputs();
    }).catch(()=>{
      setShowAlertErrorCPF(true);
    });
  }catch(err){
  }
    
  }
  return (
    <IonPage>
      <IonReactRouter>
        <IonReactNav detail={() => <TechDetail {...pessoa} />}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Lista de Pessoas</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">Lista de Pessoas</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonList>
               {pessoas.map((pessoa, i) =>(
                <IonItemSliding key={pessoa.id}>
                  <IonItem onClick={() => setPessoa(pessoas[i])}>
                    <IonLabel>
                      <h2>{pessoa.nome}</h2>
                      <p>RG: {pessoa.rg}</p>
                      <p>Nascimento: {pessoa.dt_nasc_formatted}</p>
                    </IonLabel>
                    <IonNote slot="end">
                      {pessoa.cpf_formatado}
                    </IonNote>
                  </IonItem>
        
        
                  <IonItemOptions side="end">
                    <IonItemOption onClick={()=>handleTrash(pessoa.id)} color="danger">
                      <IonIcon slot="icon-only" icon={trash} />
                    </IonItemOption>
                    <IonItemOption>
                      <IonIcon onClick={() => handleEdit(pessoa.id)} slot="icon-only" icon={pencil} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
        
                ))}
            </IonList>
            <IonModal isOpen={showModal} cssClass='my-custom-class'>
              {pessoaEdit && (
              <IonList>
                <h2 style={{textAlign:"center"}}>Editar Pessoa</h2>
                <IonItem>
                <IonLabel position="stacked">NOME</IonLabel>
                <IonInput ref={inputNome} value={pessoaEdit.nome} ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">CPF</IonLabel>
                <IonInput ref={inputCPF} value={pessoaEdit.cpf} ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">RG</IonLabel>
                <IonInput ref={inputRG} value={pessoaEdit.rg}></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Data de Nascimento</IonLabel>
                <IonInput ref={inputDtNasc} value={pessoaEdit.dt_nasc_formatted} ></IonInput>
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
              <IonButton className="button-edit" expand="block" onClick={()=>handleUpdate(pessoaEdit.id)}>Salvar a edição</IonButton>
            </IonList>
              )}
              
              <IonButton color="danger" onClick={() => setShowModal(false)}>Fechar</IonButton>
            </IonModal>

            <IonToast
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              message="Registro alterado com sucesso"
              color="primary"
              duration={500}
            />
            <IonToast
              isOpen={showAlertExcluido}
              onDidDismiss={() => setShowAlertExcluido(false)}
              message="Registro alterado com sucesso"
              color="primary"
              duration={500}
            />
            <IonAlert
              isOpen={showAlertErrorCPF}
              onDidDismiss={() => setShowAlertErrorCPF(false)}
              cssClass='my-custom-class'
              header={'Alert'}
              subHeader={'Erro ao atualizar a pessoa'}
              message={'CPF inválido'}
              buttons={['OK']}
            />
            <IonAlert
              isOpen={showAlertErrorDate}
              onDidDismiss={() => setShowAlertErrorDate(false)}
              cssClass='my-custom-class'
              header={'Alert'}
              subHeader={'Erro ao atualizar a pessoa'}
              message={'Formato de data incorreto. Ex: dd/mm/aaaa'}
              buttons={['OK']}
            />
            <IonAlert
              isOpen={showAlertErrorExcluido}
              onDidDismiss={() => setShowAlertErrorExcluido(false)}
              cssClass='my-custom-class'
              header={'Alert'}
              subHeader={'Erro ao excluir a pessoa'}
              message={'Item já excluido!'}
              buttons={['OK']}
            />
          </IonContent>
        </IonReactNav>
      </IonReactRouter>
    </IonPage>
  );
};

export default Home;
