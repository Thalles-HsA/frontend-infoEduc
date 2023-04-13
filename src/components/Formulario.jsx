import React, { useState } from 'react';
import axios from 'axios';

import "./Formulario.css"

function Formulario() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErr('Nenhum arquivo selecionado');
      return;
    }

    setErr('')

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://info-educ.herokuapp.com/api/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);

      if (!res.data.valid) {
        setFile(null)
      }

      console.log(res.data)

    } catch (err) {
      console.error(err.res.data);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClear = () => {
    setFile(null);
    setResult(null)
  };

  return (
    <div className='container'>

      <h1>Validador de XML InfoEduc Company</h1>
      <form onSubmit={handleSubmit}>
        {!result ? (
          <>
            <div style={{ position: 'relative' }}>
              {err && <span style={{ position: 'absolute', top: '-2.5rem', left: '1.2rem' }}>{err}</span>}
              <label>
                Selecione seu arquivo XML
                <input type="file" onChange={handleFileChange} accept=".xml" />
              </label>
            </div>
            { !file 
              ? <button type="submit" disabled>Selecione seu arquivo</button> 
              : <button type="submit">Enviar XML</button> 

            }
            
          </>
        ) : (
          <>
          { !result.valid 
            ? <button type="submit" onClick={handleClear}>Enviar XML Corrigido</button>
            : <button type="submit" onClick={handleClear}>Enviar novo XML</button>
          }
            
          </>
        ) 
        }

      </form>
      {
        result && (
          <div>
            <h3>Resultado:</h3>
            <p>{result.valid ? 'XML válido - Enviado com sucesso para o servidor' : 'XML inválido'}</p>
            <ul>
              {result.errors.map((error) => (
                <li key={`${error.line}-${error.column}`}><strong>Erro na linha {error.line} | coluna {error.column}</strong> - Menssagem: {error.message}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div >
  );
}

export default Formulario;


