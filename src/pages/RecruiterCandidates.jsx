import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import axios from 'axios';

const RecruiterCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const baseURL = 'http://localhost:3500/';

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
              const response = await axios.get(`${baseURL}api/schedule/candidates`, {
                withCredentials: true,
              });
              setCandidates(response.data.candidates);
            } catch (error) {
              console.error('Error fetching candidates:', error);
              toast.error('Failed to fetch candidates.');
            }
          };
          fetchCandidates();
    })

  return (
    <div className="animate-fade-in space-y-6">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Candidates</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your candidate interviews.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <li key={candidate.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{candidate.name}</p>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
                
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    candidate.status === 'scheduled' 
                      ? 'bg-blue-100 text-blue-800' 
                      : candidate.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>                    
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    {candidate.status === 'pending' ? 'Schedule' : 'View'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RecruiterCandidates
