import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Link,
    List,
    ListItem,
} from '@mui/material';

export default function PrivacyPolicy() {
    return (
        <Box className="flex flex-center">
            <Paper sx={{ maxWidth: 1000, padding: 2 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    "My new words" Privacy Policy
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Nikolay.Kuznetsov built the "My new words" app as a Free app. This SERVICE is provided by Nikolay.Kuznetsov at no cost and is intended for use as is.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at "My new words" unless otherwise defined in this Privacy Policy.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Information Collection and Use
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    The app does use third-party services that may collect information used to identify you.
                </Typography>

                Links to the privacy policy of third-party service providers used by the app:

                <List dense sx={{ mb: 2 }}>
                    <ListItem>
                        <Link href="https://www.google.com/policies/privacy/">Google Play Services</Link>
                    </ListItem>
                    <ListItem>
                        <Link href="https://firebase.google.com/support/privacy/">Firebase Crashlytics</Link>
                    </ListItem>
                </List>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Log Data
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    I want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing my Service, the time and date of your use of the Service, and other statistics.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Service Providers
                </Typography>

                I may employ third-party companies and individuals due to the following reasons:

                <List dense>
                    <ListItem>
                        To facilitate our Service;
                    </ListItem>
                    <ListItem>
                        To provide the Service on our behalf;
                    </ListItem>
                    <ListItem>
                        To perform Service-related services; or
                    </ListItem>
                    <ListItem>
                        To assist us in analyzing how our Service is used.
                    </ListItem>
                </List>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    I want to inform users of this Service that these third parties have access to their Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Security
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    I value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Children’s Privacy
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    These Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13 years of age. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do the necessary actions.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Changes to This Privacy Policy
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    I may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    This policy is effective as of 2022-12-21
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                    Contact Us
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at <Link href="mailto:micurino@gmail.com">micurino@gmail.com</Link>.
                </Typography>
            </Paper>
        </Box>
    );
}