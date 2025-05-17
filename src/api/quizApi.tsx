import axios from 'axios';

const API_URL = 'https://usa-v1.onrender.com';

const formatQuestionType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'short answer':
      return 'short_answer';
    case 'multiple choice':
      return 'multiple_choice';
    case 'descriptive':
      return 'description';
    default:
      return type.toLowerCase();
  }
};

export const generateQuestions = async (
  subject: string,
  questionType: string,
  difficulty: string,
  numberOfQuestions: number,
  imageFile: File | null 
) => {
  const formData = new FormData();

  formData.append(
    'data',
    JSON.stringify({
      subject: subject.toLowerCase(),
      question_type: formatQuestionType(questionType), 
      difficulty: difficulty.toLowerCase(),
      number_of_questions: numberOfQuestions,
    })
  );

  if (imageFile) {
    formData.append('textbook_image', imageFile); 
  }

  const response = await axios.post(`${API_URL}/questions/generate`, formData);
  return response.data;
};

export const verifyAnswer = async (question: string, answer: string, type: string) => {
  const response = await axios.post(`${API_URL}/questions/verify`, {
    question,
    answer,
    question_type: formatQuestionType(type)
  });
  return response.data;
};