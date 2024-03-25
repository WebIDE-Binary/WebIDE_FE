// MainPage.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({
        projectName: '',
        projectExplanation: '',
        programmingLanguages: '',
        teamName: '',
        participants: [],
    });

    useEffect(() => {
        const fetchProjects = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const projectsUrl = `${baseUrl}/api/home/projects`;
            const response = await fetch(projectsUrl);
            const data = await response.json();
            const projectData = await fetchProjects.json();
            if (data.statusCode === 200) {
                setProjects(data.data);
                const projectId = projectData.data.projectId;
                await createFile(projectId, null, 'index.html', 'F', '<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>Hello World!</body></html>');
                await createFile(projectId, null, 'style.css', 'F', 'body { font-family: Arial, sans-serif; }');
            }
        };
        fetchProjects();
    }, []);
    const createFile = async (projectId, parentId, fileName, fileType, content) => {
        // 여기서는 파일 내용을 직접 API로 전송하는 방식을 가정합니다.
        // 실제 구현에서는 파일 내용을 처리하는 방식이 API 설계에 따라 다를 수 있습니다.
        await fetch('/api/ide/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer your-token-here`,
            },
            body: JSON.stringify({
                projectId,
                parentId,
                fileName,
                fileType,
                content, // 이 예제에서는 파일 내용을 API 요청의 일부로 보냅니다. 실제 API의 구현에 따라 다를 수 있습니다.
            }),
        });
    };
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleCreateProject = async () => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const projectsUrl = `${baseUrl}/api/projects`;
        const response = await fetch(projectsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject),
        });
        const data = await response.json();
        if (data.statusCode === 200) {
            setShowModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    return (
        <div className="container box">
            <Button className="btn" onClick={handleShowModal}>프로젝트 생성</Button>
            <div className="project-container">
                프로젝트 목록
                {projects.map((project) => (
                    <div key={project.projectId}>
                        <h3>
                            <Link to={`/projects/${project.projectId}`}>{project.title}</Link>
                        </h3>
                        <p>{project.summary}</p>
                    </div>
                ))}
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>프로젝트 생성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>프로젝트 이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="projectName"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>프로젝트 설명</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="projectExplanation"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>팀 이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="teamName"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleCreateProject}>
                        생성
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MainPage;
