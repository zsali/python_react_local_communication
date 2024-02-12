import React, { useEffect, useState } from "react";

import { Form } from "semantic-ui-react";
import axios from "axios";

function SubmitForm() {
  const options = [
    { key: "m", text: "Male", value: "male" },
    { key: "f", text: "Female", value: "female" },
    { key: "o", text: "Other", value: "other" },
  ];
  const ipOptions = [
    { key: "0", text: "126.01.98.45", value: "126.01.98.45" },
    { key: "1", text: "126.01.98.43", value: "126.01.98.43" },
    { key: "2", text: "126.01.98.42", value: "126.01.98.42" },
    { key: "3", text: "126.01.98.40", value: "126.01.98.40" },
    { key: "4", text: "126.01.98.41", value: "126.01.98.41" },
    { key: "5", text: "126.01.98.44", value: "126.01.98.44" },
  ];
  const [value, setValue] = useState("126.01.98.45");

  const [ip, setIP] = useState("");
  const [ipSelectDynamic, setIpSelectDynamic] = useState(0);

  const handleChange = (e, { value }) => {
    setValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .get(`https://${ipOptions[ipSelectDynamic].value}`)
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));

    changeIP();
  };

  useEffect(() => {
    getData();
    changeIP();
  }, []);

  const changeIP = () => {
    setIpSelectDynamic(Math.floor(Math.random() * ipOptions.length));
  };

  const getData = async () => {
    try {
      const res = await axios.get("https://api.ipify.org/?format=json");
      setIP(res.data.ip);
    } catch (error) {
      console.log("Error fetching IP address:", error);
    }
  };

  const handleButtonClick = async () => {
    try {
      await axios
        .post("/change_ip", {
          // ip_address: "77.111.247.138",
          // subnet_mask: "255.255.254.0",
          proxy_url: "143.254.238.5",
          proxy_port: "3128",
          url: "https://insurancebundledeal.com/",
        })
        .then((resp) => {
          getData();
          console.log(resp);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input fluid label="First name" placeholder="First name" />
          <Form.Input fluid label="Last name" placeholder="Last name" />
          <Form.Select
            fluid
            label="Gender"
            options={options}
            placeholder="Gender"
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Select
            fluid
            label="IP Address"
            options={ipOptions}
            placeholder="Select IP"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Your Ip Address"
            placeholder="Your IP Address"
            value={ip}
          />
        </Form.Group>
        <Form.TextArea label="About" placeholder="Tell us more about you..." />
        <Form.Checkbox label="I agree to the Terms and Conditions" />
        <Form.Button primary>Submit</Form.Button>
      </Form>
      <h1>IP Address Changer</h1>
      <button onClick={handleButtonClick}>Change IP Address</button>
    </>
  );
}

export default SubmitForm;
