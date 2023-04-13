import "./GetXml.css"

import { api } from "../utils/config";


import { AiOutlineCloudDownload } from 'react-icons/ai'
import { BsFillTrashFill, BsCheck } from "react-icons/bs"

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { getXml, deleteXml } from '../slices/xmlSlice';

const GetXml = () => {

    const dispatch = useDispatch();
    const { xmls } = useSelector((state) => state.xml);

    useEffect(() => {
        dispatch(getXml());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteXml(id));
    };

    const formatDate = (date) => {
        const data = new Date(date);
        const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = data.toLocaleDateString('pt-BR', opcoes);
        const horaFormatada = data.toLocaleTimeString('pt-BR');
        return `${dataFormatada} às ${horaFormatada}`;
    }

    return (
        <div className="container-xml">
            {xmls &&
                <table>
                    <thead>
                        <tr>
                            <th>Arquivo</th>
                            <th>Data do upload</th>
                            <th>Status</th>
                            <th>Download</th>
                            <th>Deletar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {xmls.map((xml) => (
                            <tr key={xml._id}>
                                <td>{xml.title}</td>
                                <td>{formatDate(xml.data)}</td>
                                <td><BsCheck color="green"/>Validado com sucesso</td>
                                <td>
                                    <a href={`${api}/download/${xml._id}`} download>
                                        <AiOutlineCloudDownload size="32px" color="#00ADB5" cursor="pointer" />
                                    </a>
                                </td>
                                <td>
                                    <BsFillTrashFill size="24px" cursor="pointer" onClick={() => handleDelete(xml._id)}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

            {xmls && xmls.length === 0 &&
                <h2>Ainda não tem XML validado</h2>
            }
        </div>
    )
}

export default GetXml
