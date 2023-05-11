// Imports the Google Cloud client library
const textToSpeech = require( '@google-cloud/text-to-speech' );

// Import other required libraries
const fs = require( 'fs' );
const util = require( 'util' );
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

const text = 'యుధిష్ఠిర ఉవాచ – కిమేకం దైవతం లోకే కిం వాప్యేకం పరాయణమ్ | స్తువంతః కం కమర్చంతః ప్రాప్నుయుర్మానవాః శుభమ్ || ౮ ||';

async function tts( { text, outFile } ) {
  // The text to synthesize


  // Construct the request
  const request = {
    input: { text },
    // Select the language and SSML voice gender (optional)
    // ref: https://cloud.google.com/text-to-speech/docs/voices
    voice: { languageCode: 'te-IN', ssmlGender: 'NEUTRAL' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.75 },
  };

  // Performs the text-to-speech request
  const [ response ] = await client.synthesizeSpeech( request );
  // Write the binary audio content to a local file
  const writeFile = util.promisify( fs.writeFile );
  await writeFile( outFile, response.audioContent, 'binary' );
  console.log( `Audio content written to file: ${outFile}` );
}

// node src/tts/sample.js
tts( { text, outFile: './data/output.mp3' } );