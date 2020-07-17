import React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Icon,
  Card,
  CardContent,
} from "@material-ui/core";
import { stringify, FinalResult } from "../services/share-scorepad";
import { useNotify } from "../NotificationsProvider";
import { copiedScoreLinkEventGA } from "../../analytics";

export interface ShareScoreProps {
  finalResult: FinalResult;
}

export const ShareScore: React.FC<ShareScoreProps> = ({ finalResult }) => {
  const notify = useNotify();

  const compressedData = stringify(finalResult);
  const scoreUrl = `${window.location.protocol}//${window.location.host}/score/${compressedData}`;
  return (
    <Card>
      <CardContent>
        <h3>Endergebnis teilen</h3>
        <p>
          Teile den Link um das Ergebnis deinen Freunden zu zeigen oder um es
          für dich abzuspeichern.
        </p>
        <TextField
          value={scoreUrl}
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="start">
                <Button
                  startIcon={<Icon>file_copy</Icon>}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(scoreUrl);
                      notify({
                        message: "Link wurde in die Zwischenablage kopiert",
                        icon: "done",
                      });
                      copiedScoreLinkEventGA();
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Kopieren
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};
