import "./App.css";
import { Grid } from "semantic-ui-react";
import Messages from "./components/Messages/Messages";
import SubmitForm from "./components/Form/Form";

function App() {
  return (
    <Grid columns="equal" className="app" style={{ background: "#e3e3e3" }}>
      <Grid.Column>
        {/* <Messages /> */}
        <SubmitForm />
      </Grid.Column>
    </Grid>
  );
}

export default App;
