import React, {useState} from 'react';
import { HfInference } from '@huggingface/inference'
import {Breadcrumb, Button, Col, Input, Layout, Menu, Row, theme} from 'antd';
import {mockArticle} from './mock/MockArticle';
import './App.css';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [sendText, setSendText] = useState(mockArticle);
    const [responseText, setResponseText] = useState('');

    const hf = new HfInference(process.env.REACT_APP_TOKEN);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const generate = async () => {
        setIsLoading(true);

        if (sendText.length < 1) {
            setIsLoading(false);
            return;
        }

        const result = await hf.summarization({
            model: 'sambydlo/bart-large-scientific-lay-summarisation',
            inputs: sendText,
            parameters: {
                max_length: 1000,
            }
        })

        setResponseText(result.summary_text);

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
                        <Col span={8} xs={24} xl={8}>
                            <TextArea
                                style={{ height: 500, marginBottom: 24 }}
                                placeholder="Исходный текст"
                                onChange={(data) => setSendText(data.target.value)}
                                value={sendText}
                            />
                        </Col>
                        <Col
                            span={6}
                            xs={24}
                            xl={8}
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
                        <Col span={8} xs={24} xl={8}>
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
