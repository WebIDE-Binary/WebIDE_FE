import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react'; // Monaco Editor를 사용하기 위해 임포트합니다.
import { Button, Modal, Form } from 'react-bootstrap';

const IDEPage = ({ projectId }) => {
    const [fileTree, setFileTree] = useState([]);
    const [executionResult, setExecutionResult] = useState('여기에 실행 결과가 표시됩니다.');
    const [openFiles, setOpenFiles] = useState([]); // 열린 파일 목록
    const [currentFile, setCurrentFile] = useState(null); // 현재 선택된 파일
    const [showModal, setShowModal] = useState(false); // 파일/폴더 생성 모달 상태
    const [newFileName, setNewFileName] = useState(''); // 새 파일/폴더 이름
    // 프로젝트 파일 트리를 조회하는 API 호출
    useEffect(() => {
        const fetchFileTree = async () => {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/ide/${projectId}`, {
                method: 'GET',
                headers: {
                    Authorization: `bearer fdksjgbowjebwogvbskjdbfsjbgojsbdgskgbskdjbgksjdbgjksbdgkjsbljgbdsj`,
                },
            });
            const data = await response.json();
            if (data.statusCode === 200) {
                setFileTree(data.data.fileTree);
            }
        };
        fetchFileTree();
    }, [projectId]);
    const fetchFileContent = async (fileId) => {
        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer fdksjgbowjebwogvbskjdbfsjbgojsbdgskgbskdjbgksjdbgjksbdgkjsbljgbdsj',
                    // 필요한 경우 추가 헤더를 여기에 설정
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }
            const data = await response.json();
            // 이 부분은 실제 서버 응답 구조에 따라 조정이 필요할 수 있습니다.
            return data.content; // 파일의 내용을 반환
        } catch (error) {
            console.error("Error fetching file content:", error);
            return ""; // 오류 발생 시 빈 문자열 반환
        }
    };
    const getLanguageByExtension = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const languageMap = {
            'java': 'java',
            'js': 'javascript',
            'py': 'python',
            // 추가적으로 지원하고 싶은 파일 확장자를 여기에 매핑
        };
        return languageMap[extension] || 'plaintext'; // 매핑되지 않은 확장자는 plaintext로 처리
    };
    
    const handleCreateFileOrFolder = async () => {
        const fileType = newFileName.includes('.') ? 'F' : 'D';
        const requestBody = {
            projectId,
            parentId: null, // 이 예제에서는 최상위 디렉토리에 파일/폴더를 생성합니다. 필요에 따라 parentId 설정
            fileName: newFileName,
            fileType,
        };
    
        try {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/ide/files`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer fdksjgbowjebwogvbskjdbfsjbgojsbdgskgbskdjbgksjdbgjksbdgkjsbljgbdsj`,
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (data.statusCode === 200) {
                // 파일/폴더 생성 성공 후 로직
                // 예: 파일 트리 업데이트, 새 파일/폴더를 에디터에서 바로 열기 등
                console.log('File/Folder created successfully:', data);
                // 생성된 파일/폴더를 파일 트리에 추가하는 로직 필요
            } else {
                console.error('Failed to create file/folder:', data.message);
            }
        } catch (error) {
            console.error('Error creating file/folder:', error);
        }
    };

    function FileTree({ fileTree }) {
        const renderTree = (nodes) => (
            <ul style={{ listStyleType: 'none', padding: '5px' }}>
                {nodes.map((node) => (
                    <li key={node.fileId}>
                        {node.fileName}
                        {node.fileType === 'D' && node.children && renderTree(node.children)}
                    </li>
                ))}
            </ul>
        );

        return <div>{renderTree(fileTree)}</div>;
    }

    const ExecutionResult = ({ result }) => {
        return (
            <div style={{
                padding: '10px',
                backgroundColor: '#eeeeee',
                overflowY: 'auto', // 내용이 많을 경우 스크롤
                borderLeft: '1px solid #ddd', // 좌측에 경계선 추가
            }}>
                <pre>{result}</pre>
            </div>
        );
    };
    const handleFileClick = async (file) => {
        // 파일이 이미 열려 있지 않은 경우 새로 열기
        if (!openFiles.find(f => f.fileId === file.fileId)) {
            const fileContent = await fetchFileContent(file.fileId); // API를 통해 파일 내용을 가져옴
            const newFile = { ...file, content: fileContent };
            setOpenFiles(prev => [...prev, newFile]);
        }
        setCurrentFile(file);
    };

    const handleShowModal = () => setShowModal(true);

    // 파일/폴더 생성 모달 닫기 핸들러
    const handleCloseModal = () => setShowModal(false);

    // 파일/폴더 생성 요청 핸들러
    const currentLanguage = currentFile ? getLanguageByExtension(currentFile.fileName) : "plaintext";

    const currentFileContent = currentFile ? openFiles.find(f => f.fileId === currentFile.fileId)?.content : "";
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '20%', backgroundColor: '#f5f5f5' }}>
                <Button onClick={handleShowModal}>파일/폴더 생성</Button>
                <div style={{ width: '20%', backgroundColor: '#f5f5f5' }}>
                    <FileTree fileTree={fileTree} />
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <div className="tabs">
                    {openFiles.map(file => (
                        <div key={file.fileId} onClick={() => setCurrentFile(file)}>
                            {file.fileName}
                        </div>
                    ))}
                </div>
                <Editor
                    height="100%"
                    defaultLanguage={currentLanguage}
                    value={currentFileContent}
                />
            </div>
            <div style={{ width: '30%', backgroundColor: '#f5f5f5' }}>
                <ExecutionResult result={executionResult} />
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>파일/폴더 생성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="파일/폴더 이름을 입력하세요."
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleCreateFileOrFolder}>
                        생성
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};



export default IDEPage;
