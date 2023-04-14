import React, { useState } from 'react';
// import axios from 'axios';

import { xmlUpload, resetMessage, xmlValidar, } from '../slices/xmlSlice';
import { useSelector, useDispatch } from "react-redux";

import jsPDF from "jspdf"

import "./Formulario.css"
import GetXml from './GetXml';

function Formulario() {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("")
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [submit, setSubmit] = useState(false);
  const [validar, setValidar] = useState(true)

  const dispatch = useDispatch();

  const {
    loading: loadingXml,
    error: errorXml,
    sucess: sucessXml,
    message: messageXml,
  } = useSelector((state) => state.xml);

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
      validado: validar,
    };


    const formData = new FormData();

    const xmlFormData = Object.keys(xmlData).forEach((key) =>
      formData.append(key, xmlData[key])
    );

    formData.append("xml", xmlFormData);

      console.log(validar)
    try {

      if(validar) {
        console.log("validar")
        dispatch(xmlValidar(formData)) 
      } else {
        console.log("salvar")
        dispatch(xmlUpload(formData))
      }

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

  function gerarPDF(errorXml) {
    const doc = new jsPDF();

    const listaErros = errorXml.map((error) => {
      const mensagemLinhas = error.message.match(/.{1,45}/g);
      return `Erro na linha ${error.line} | coluna ${error.column} - ${mensagemLinhas.join('\n' + ' '.repeat(45))}`;
    });

    doc.text('Lista de erros:', 10, 10);
    doc.text(listaErros.join('\n'), 10, 30, { textColor: 'black' });

    // Salva o arquivo
    doc.save('erros.pdf');
  }

  function handleCheckboxChange(event) {
    setValidar(event.target.checked);
    console.log(validar)
  }

  const handleClear = () => {
    setFile(null);
    setErr(null);
    setNomeArquivo('');
    setSubmit(false);
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
                  <input type="file" onChange={handleFileChange} accept=".xml" cursor="pointer"/>
                </label>

                {nomeArquivo && (
                  <>
                    <p style={{ position: 'absolute', top: '2.5rem', left: '1.2rem' }} className="arquivo"> {nomeArquivo}</p>
                    <label className='input-validar'>
                      Validar XML
                      <input type="checkbox" checked={validar} onChange={handleCheckboxChange} />
                    </label>
                  </>

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
                {errorXml &&
                  <button type='button' onClick={() => gerarPDF(errorXml)} className="botao-pdf">Gerar PDF com erros</button>
                }
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
      <GetXml validar={validar}/>
    </>
  );
}

export default Formulario;


