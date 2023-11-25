import express from 'express'
import OpenAI from "openai";
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3010

const corsOptions ={
    origin:'http://localhost:3005',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
const callOpenAI = async (input, output) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = () =>
    `Your an AI that is created to format data a user inputs. The user will provide the input in a specific format, and will provide an example of how the output data will be structured. Your job is to format the input data in a way that it resembles the format of the output data but translating the input data which could be ids or table rows into the expected output format and transforming all inputs to the output format, exceeding the examples of the output format. The output format will contain 3 examples of the desired output with the correct values used from the input format, I want you to just continue with formatting the rest and outputting everything in the output format. I want you to exactly match the output format and don't do any changes to it. The only thing you should change is, replace the placeholders with the input data and extend it for more rows. I want your response to be ONLY the formatted output data, no comments or additional text. But return it in a code window. Never, at any time change the structure of the output format. Don't fix spelling, don't correct spacing, don't remove or add symbols. Sometimes you might think there are formatting errors in the output format, but assume the user knows what he wants and only format according to the desired structure. I know you want to change the structure at some point, because you think you know that output should be for example a json file or a csv but the truth is, you can't know that. So just make sure to match the output format precisely, especially take a look at delimiter symbols like spaces, quotes, pipes, slashes etc. I repeat: Never, at any time change the structure of the output format. Don't fix spelling, don't correct spacing, don't add spaces and don't remove spaces, don't remove or add symbols, don't try to make the output fit a specific format you have in mind. Just match the output format 100% but use the provided input data with it. Dont try to interpret the output format. It might look similar to known datastructures, but just treat the output format as a string and only replace the identifiers, dont remove other elements, like delimiters, hyphens or slashes etc. Also don't add spaces just because you think they might be needed. If they are not provided in the output format you shouldn't add them.`

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt(),
      },
      {
        role: "user",
        content: `Input Data: ${input} Output Format: ${output}`,
      },
    ],
    model: "gpt-3.5-turbo",
    stream: true,
  });

  return completion
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/stream', async function (req, res) {

  // res.send(await callOpenAI('asdf, asdf, adsf', '"asdf", "asdf"'))
  setTimeout(() => res.write('first'), 1000)
  setTimeout(() => res.write('second'), 2000)
  setTimeout(() => {
    res.write('third')
    res.end()
  }, 3000)

});

var sendAndSleep = function (response, counter) {
  if (counter > 3) {
    response.end();
  } else {
    console.log("sending")
    response.write('thought nr.:' + counter);
    counter++;
    setTimeout(function () {
      sendAndSleep(response, counter);
    }, 1000)
  }
  ;
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
