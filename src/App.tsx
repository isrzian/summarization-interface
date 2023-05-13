import React, {useState} from 'react';
import axios from 'axios';
import {Breadcrumb, Button, Col, Input, Layout, Menu, Row, theme} from 'antd';
import './App.css';
import {mockArticle} from './mock/MockArticle';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [sendText, setSendText] = useState(mockArticle);
    const [responseText, setResponseText] = useState('');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    async function createPromiseQuery(data: string) {
        return axios.post(
            'https://api-inference.huggingface.co/models/sambydlo/bart-large-scientific-lay-summarisation',
            {inputs: data},
            {

                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`,
                    'Access-Control-Allow-Headers': 'Authorization',
                    'content-type': 'application/json'
                }
            }
        );
    }

    const generate = async () => {
        setIsLoading(true);

        if (sendText.length < 1) {
            setIsLoading(false);
            return;
        }

        const result = await createPromiseQuery(sendText)
            // .then(({data}) => data)
            // .catch(() => {
            //     alert('Возникла ошибка!');
            //     setIsLoading(false);
            // });
        console.log('result', result)

        setResponseText(result.data.summary_text);

        setIsLoading(false);
    }

  return (
    <div className="App">
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={[{
                        key: 1,
                        label: 'Тестовый образец нейросети суммаризации научных текстов'
                    }]}
                />
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content" style={{ background: colorBgContainer }}>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <TextArea
                                style={{ height: 500, marginBottom: 24 }}
                                placeholder="Исходный текст"
                                onChange={(data) => setSendText(data.target.value)}
                                value={sendText}
                            />
                        </Col>
                        <Col
                            span={6}
                            style={{ display: 'flex', justifyContent: 'center'}}
                        >
                            <Button
                                size='large'
                                onClick={generate}
                                loading={isLoading}
                            >
                                Сгенерировать
                            </Button>
                        </Col>
                        <Col span={8}>
                            <TextArea
                                style={{ height: 500, marginBottom: 24 }}
                                placeholder="Сгенерированная суммаризация"
                                value={responseText}
                            />
                        </Col>
                    </Row>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>СФУ ©2023 Научная библиотека</Footer>
        </Layout>
    </div>
  );
}

export default App;
