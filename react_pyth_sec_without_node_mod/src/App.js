import { useRef, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TextField,
} from "@mui/material";
import IpAddressData from "./DummyData";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function App() {
  const [classToggle, setClassToggle] = useState("SelectAnIP");
  const initialState = {
    ip: "",
    port: "",
    url: "",
  };
  const [ipInfo, setIpInfo] = useState(initialState);

  const formRef = useRef();

  const ipData = IpAddressData.ipInfo;

  const ipCategory = (buttonName) => {
    // setIpInfo(initialState);
    formRef.current.reset();

    if (classToggle !== buttonName) {
      setClassToggle(buttonName);
    }
  };

  const handleInputChange = (formik, event) => {
    let inputText = event.target.name;
    setIpInfo({ ...ipInfo, [inputText]: event.target.value });
    formik.setFieldValue([inputText], event.target.value);
  };

  const handleSelectData = (formik, item) => {
    setIpInfo({
      ...ipInfo,
      ip: item.target.value.ip,
      port: item.target.value.port,
    });
    formik.setFieldValue("ip", item.target.value.ip);
    formik.setFieldValue("port", item.target.value.port);
  };

  const ipFormValidate = Yup.object({
    ip: Yup.string()
      .matches(
        /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        "IP Address is not valid"
      )
      .required("Ip Address is Required"),
    port: Yup.string().required("Port Is Required"),
    url: Yup.string().required("Url Is Required"),
  });

  const handleSubmit = async (values) => {
    try {
      await axios
        .post("/change_ip", {
          proxy_url: values.ip,
          proxy_port: values.port,
          url: values.url,
        })
        .then((resp) => {
          console.log(resp);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Formik
        initialValues={ipInfo}
        validationSchema={ipFormValidate}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {(formik) => (
          <Form ref={formRef}>
            <Box width={600}>
              <div className="topButton">
                <Button
                  className={
                    classToggle === "SelectAnIP"
                      ? "borderedButton active"
                      : "borderedButton"
                  }
                  onClick={() => ipCategory("SelectAnIP")}
                >
                  Select An IP
                </Button>
                <Button
                  className={
                    classToggle === "AddIP"
                      ? "borderedButton active"
                      : "borderedButton"
                  }
                  onClick={() => ipCategory("AddIP")}
                >
                  Add The IP
                </Button>
              </div>
              <Card>
                <CardContent>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: 16 }}
                  >
                    {classToggle === "SelectAnIP" ? (
                      <>
                        <InputLabel>Select An IP</InputLabel>
                        <Select
                          label="Select an option"
                          name="selectIp"
                          onChange={(event) => handleSelectData(formik, event)}
                          defaultValue=""
                        >
                          {ipData &&
                            ipData.map((item) => (
                              <MenuItem key={item.id} value={item}>
                                {item.ip}
                              </MenuItem>
                            ))}
                        </Select>
                        <ErrorMessage
                          component="div"
                          name="ip"
                          className="error"
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          label="Enter The IP"
                          variant="outlined"
                          name="ip"
                          style={{ marginTop: 10 }}
                          onChange={(event) => handleInputChange(formik, event)}
                        />
                        <ErrorMessage
                          component="div"
                          name="ip"
                          className="error"
                        />
                        <TextField
                          label="Add Port"
                          variant="outlined"
                          name="port"
                          style={{ marginTop: 10 }}
                          type="number"
                          onInput={(e) => {
                            e.target.value = Math.max(
                              0,
                              parseInt(e.target.value)
                            )
                              .toString()
                              .slice(0, 6);
                          }}
                          onChange={(event) => handleInputChange(formik, event)}
                        />
                        <ErrorMessage
                          component="div"
                          name="port"
                          className="error"
                        />
                      </>
                    )}

                    <TextField
                      label="Enter The Url"
                      variant="outlined"
                      name="url"
                      style={{ marginTop: 10 }}
                      onChange={(event) => handleInputChange(formik, event)}
                    />
                    <ErrorMessage
                      component="div"
                      name="url"
                      className="error"
                    />
                  </FormControl>

                  <Button type="submit" variant="contained" color="primary">
                    Search
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
