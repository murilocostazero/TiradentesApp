// StudentPdf.js
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { behaviorToPT, dateToString, severityToPT, typeToPT } from '../../utils/helper';

import axiosInstance from '../../utils/axiosIntance';
import MontserratRegular from '../../assets/fonts/Montserrat-Regular.ttf';
import MontserratBold from '../../assets/fonts/Montserrat-Bold.ttf';
import MontserratItalic from '../../assets/fonts/Montserrat-Italic.ttf';
import logoCmt from '../../assets/images/logo-cmt.png';

// Registre a fonte Poppins
Font.register({
    family: 'Montserrat',
    fonts: [
        { src: MontserratRegular, fontWeight: 'normal' },
        { src: MontserratItalic, fontWeight: 'normal', fontStyle: 'italic' },
        { src: MontserratBold, fontWeight: 'bold' },
        // Adicione mais estilos e pesos conforme necessário
    ],
});

const StudentPdf = ({ student }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const { fullName, behavior, photoUrl, positiveObservations } = student;

    useEffect(() => {
        getIncidents();
    }, []);

    const getIncidents = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/incident/student/${student._id}`);
            if (response.status >= 400 && response.status <= 500) {
                showStatusBar('Nenhuma ocorrência encontrada', 'error');
            } else {
                setIncidents(response.data);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    const StudentDocument = () => (
        <Document>
            <Page size="A4" style={{ padding: 28, fontFamily: 'Montserrat' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Image
                        src={logoCmt}
                        style={{ width: 80, height: 30 }} // Define a largura, altura e estilo da imagem
                    />
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Text style={{ fontWeight: 700, fontSize: 12 }}>Colégio Militar Tiradentes XXIV</Text>
                        <Text style={{ fontSize: 10 }}>{dateToString(Date.now())}</Text>
                    </View>
                </View>

                <Text style={{ fontWeight: 700, fontSize: 18, textAlign: 'center', marginBottom: 14 }}>FICHA DO ALUNO</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={{ fontWeight: 'heavy', fontSize: 10, marginRight: 4 }}>Nome:</Text>
                    <Text style={{ fontSize: 10 }}>{fullName}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'heavy', fontSize: 10, marginRight: 4 }}>Comportamento:</Text>
                    <Text style={{ fontSize: 10 }}>{behaviorToPT(behavior)}</Text>
                </View>

                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Observações Positivas:</Text>
                    <View style={{ marginTop: 4 }}>
                        {positiveObservations.map((observation, index) => (
                            <View key={index} style={{
                                marginBottom: 10, // Espaço entre as observações
                                padding: 10,
                                border: '1px solid #bdc3c7',
                                borderRadius: 5,
                                backgroundColor: '#ecf0f1',
                            }}>

                                <Text wrap style={{ fontSize: 10, marginLeft: 2 }}>{observation.observation}</Text>

                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{dateToString(observation.createdAt)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Ocorrências:</Text>
                    <View style={{ marginTop: 4 }}>
                        {incidents.map((incident, index) => (
                            <View key={index} style={{
                                marginBottom: 12, // Espaço entre os incidentes
                                padding: 10,
                                border: '1px solid #e74c3c',
                                borderRadius: 5,
                                backgroundColor: '#ffe6e6',
                            }}>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Título: </Text>
                                    {incident.title} em {dateToString(incident.date)}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Descrição: </Text>
                                    {incident.description}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Natureza: </Text>
                                    {typeToPT(incident.type)}
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={styles.bold}>Gravidade: </Text>
                                    {severityToPT(incident.severity)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <PDFDownloadLink document={<StudentDocument />} fileName={`${fullName.replace(' ', '_')}_Ficha_Aluno.pdf`}>
            {({ blob, url, loading, error }) => (loading || isLoading ? 'Carregando documento...' : 'Baixar Ficha do Aluno')}
        </PDFDownloadLink>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 10
    },
    bold: {
        fontWeight: 'bold'
    }
});

export default StudentPdf;