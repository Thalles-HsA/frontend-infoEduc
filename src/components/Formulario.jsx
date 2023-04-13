import React, { useState } from 'react';
// import axios from 'axios';

import { xmlUpload, resetMessage, } from '../slices/xmlSlice';
import { useSelector, useDispatch } from "react-redux";



import "./Formulario.css"
import GetXml from './GetXml';

function Formulario() {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("")
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [submit, setSubmit] = useState(false);


  const dispatch = useDispatch();

  const {
    loading: loadingXml,
    error: errorXml,
    sucess: sucessXml,
    message: messageXml,
  } = useSelector((state) => state.xml);

  const data = useSelector((state) => state.xml)

  function resetComponentMessage() {
    dispatch(resetMessage());
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErr('Nenhum arquivo selecionado');
      return;
    }

    setErr('')

    const xmlData = {
      title: nomeArquivo,
      xml: file,
    };


    const formData = new FormData();

    const xmlFormData = Object.keys(xmlData).forEach((key) =>
      formData.append(key, xmlData[key])
    );

    formData.append("xml", xmlFormData);

    try {
      
      dispatch(xmlUpload(formData))

      console.log(data)
      setSubmit(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setFile(selectedFile);
    setNomeArquivo(selectedFile.name);

  };

  const handleClear = () => {
    setFile(null);
    setErr(null);
    setNomeArquivo('');
    setSubmit(false)
    resetComponentMessage();
  };

  return (
    <>

      <div className='container'>
        <h1>Validador de XML InfoEduc Company</h1>
        <form onSubmit={handleSubmit}>

          {/* começa falso */}
          {submit ? (
            <>
              {errorXml
                ? <button type="submit" onClick={handleClear}>Enviar XML Corrigido</button>
                : <button type="submit" onClick={handleClear}>Enviar novo XML</button>
              }

            </>
          ) : (
            <>
              <div style={{ position: 'relative' }}>

                {err && <span style={{ position: 'absolute', top: '-2.5rem', left: '1.2rem' }}>{err}</span>}

                <label>
                  Selecione seu arquivo XML
                  <input type="file" onChange={handleFileChange} accept=".xml" />
                </label>

                {nomeArquivo && (
                  <p style={{ position: 'absolute', top: '2.5rem', left: '1.2rem' }} className="arquivo"> {nomeArquivo}</p>
                )}
              </div>
              {!file
                ? <button type="submit" disabled>Selecione seu arquivo</button>
                : !loadingXml
                  ? <button type="submit">Enviar XML</button>
                  : <button type="submit" disabled>...Enviando</button>
              }

            </>
          )
          }
        </form>


        {!sucessXml ? (
          <div>
            {messageXml && (
              <>
                <h3>Resultado:</h3>
                <p>{messageXml}</p>

                <ul>
                  {errorXml && errorXml.map((error) => (
                    <li key={`${error.line}-${error.column}`}><strong>Erro na linha {error.line} | coluna {error.column}</strong> - Mensagem: {error.message}</li>
                  ))}
                </ul>
              </>

            )}
          </div>
        ) : (
          <div>
            <h3>Resultado:</h3>
            <p>{messageXml}</p>
          </div>
        )

        }
      </div >
      <GetXml />
    </>
  );
}

export default Formulario;


