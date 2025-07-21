import React from 'react';

const CallToAction = () => {
    return (
        <div className="bg-[#edc418] p-8 rounded-lg text-center text-white max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Partagez Votre Expérience</h2>
            <p className="mb-6 max-w-lg mx-auto">Aidez les autres à prendre des décisions de carrière éclairées en partageant anonymement votre expérience professionnelle</p>
            <button className="bg-white text-[#3c78e6] font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
                Rédiger un Avis
            </button>
        </div>
    );
};

export default CallToAction;