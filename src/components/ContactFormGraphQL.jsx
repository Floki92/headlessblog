// src/components/ContactFormGraphQL.jsx
import React, { useState, useEffect } from 'react';
import { wordpressService } from '../services/wordpressService';

const ContactFormGraphQL = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const query = `
          query GetContactForm($id: ID!) {
            contactForm(id: $id, idType: DATABASE_ID) {
              formId
              title
              formFields {
                fieldName
                fieldType
                required
                options
                placeholder
              }
            }
          }
        `;
        
        const data = await wordpressService.graphqlRequest(query, { id: formId });
        setForm(data.contactForm);
        
        // Initialize form data
        const initialData = {};
        data.contactForm.formFields.forEach(field => {
          initialData[field.fieldName] = '';
        });
        setFormData(initialData);
      } catch (error) {
        console.error('Error fetching contact form:', error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mutation = `
        mutation SubmitContactForm($input: SubmitFormInput!) {
          submitForm(input: $input) {
            clientMutationId
            message
            status
          }
        }
      `;

      const variables = {
        input: {
          clientMutationId: `contact-${formId}`,
          formId: parseInt(formId),
          data: Object.entries(formData).map(([key, value]) => ({
            key,
            value
          }))
        }
      };

      const result = await wordpressService.graphqlRequest(mutation, variables);
      setResult(result.submitForm);
      
      if (result.submitForm.status === 'mail_sent') {
        // Reset form
        const resetData = {};
        Object.keys(formData).forEach(key => {
          resetData[key] = '';
        });
        setFormData(resetData);
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to send message'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div>Loading form...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">{form.title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.formFields.map(field => (
          <div key={field.fieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName.replace(/-/g, ' ')}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.fieldType === 'textarea' ? (
              <textarea
                value={formData[field.fieldName] || ''}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="4"
              />
            ) : (
              <input
                type={field.fieldType === 'email' ? 'email' : 'text'}
                value={formData[field.fieldName] || ''}
                onChange={(e) => handleChange(field.fieldName, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded-md ${
          result.status === 'mail_sent' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default ContactFormGraphQL;