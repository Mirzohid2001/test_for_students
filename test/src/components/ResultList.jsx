import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResultList() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/blog/results/')
            .then(response => {
                setResults(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the results!', error);
            });
    }, []);

    return (
        <div>
            <h1>Result List</h1>
            <ul>
                {results.map(result => (
                    <li key={result.id}>{result.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default ResultList;
