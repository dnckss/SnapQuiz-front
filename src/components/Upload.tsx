import React, { useState, useCallback } from 'react';
import pdf from '../assets/pdf_img.svg';
import Webcam from 'react-webcam';

type UploadAreaProps = {
  activeTab: string;
  onImageCapture: (imageData: string) => void;
};

const Upload: React.FC<UploadAreaProps> = ({ activeTab, onImageCapture }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = React.useRef<Webcam>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        onImageCapture(imageSrc);
        setShowCamera(false);
      }
    }
  }, [onImageCapture]);


  if (activeTab === 'import') {
    return (
      <div className="border bg-[#ffffff] border-gray-200 rounded-xl p-12 mb-8">
        {!showCamera ? (
          <div className="flex flex-col items-center justify-center">
            {capturedImage ? (
              <>
                <div className="mb-4 max-w-md w-full">
                  <img 
                    src={capturedImage} 
                    alt="Captured textbook" 
                    className="w-full h-auto rounded-xl shadow-md"
                  />
                </div>
              </>
            ) : (
              <>
                <img src={pdf} className="w-10 h-10 mb-3" />
                <p className="text-gray-700 mb-4">Upload Your PDF!</p>
                <button 
                  className="bg-[#4A6FFF] text-white px-20 py-3 rounded-xl transition-colors hover:bg-[#3258d8] flex items-center gap-2"
                  onClick={() => setShowCamera(true)}
                >
                  
                  Take a photo
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              className="rounded-lg mb-4"
            />
            <div className="flex gap-4">
              <button
                className="bg-[#4A6FFF] text-white px-8 py-3 rounded-xl transition-colors hover:bg-[#3258d8]"
                onClick={capture}
              >
                Capture photo
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl transition-colors hover:bg-gray-300"
                onClick={() => setShowCamera(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  //enter text 부분
  return (
   <>
   </>
  );
};

export default Upload;