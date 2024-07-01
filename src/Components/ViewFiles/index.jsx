import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const ViewFiles = ({ userId }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const filesRef = collection(db, 'imported_files');
        const q = query(filesRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const fileList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(fileList);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [userId]);

  return (
    <div>
      <h3>Imported Files</h3>
      <ul>
        {files.map(file => (
          <li key={file.id}>
            <strong>{file.filename}</strong>
            <p>Company ID: {file.companyId}</p>
            <p>Uploaded At: {file.createdAt.toDate().toString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewFiles;
