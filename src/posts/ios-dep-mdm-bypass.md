---
title: "iOS DEP MDM Bypass"
date: "2021-02-06"
---

This post gives a procedure for bypassing automatic Mobile Device Management (MDM) enrollment due to
Device Enrollment Program (DEP) registration on iOS. Normally, if an iOS device is registered with
DEP, it is automatically enrolled in MDM during its initial setup, which installs a profile on the
device. Schools and businesses use DEP MDM profiles to do things like automate configuration and add
restrictions, and they are not removable through the Settings app.

I have only tried this bypass on an iPhone 7 Plus running iOS 14.4, but it seems likely to work on
any iOS device that you can jailbreak. [checkra1n][1] can jailbreak iPhone 5s through iPhone X on
iOS 12 and up. Start by [restoring][2] the device. After the restore finishes, do not start setting
up the device—immediately jailbreak it. On [Mac][3], you can install checkra1n using
[Homebrew][4]. To install Homebrew, run

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then, to install checkra1n, run

```shell
brew install --cask checkra1n
```

To start checkra1n, run

```shell
xattr -d com.apple.quarantine /Applications/checkra1n.app
/Applications/checkra1n.app/Contents/MacOS/checkra1n
```

Note that checkra1n does not seem to work with USB-C to Lightning cables. After the jailbreak
finishes, you need to [SSH][5] into the device. To do this, you will need [iProxy][6], which can be
installed via [libimobiledevice][7] using Homebrew by running

```shell
brew install libimobiledevice
```

Next, forward [TCP][8] port 2222 on your computer to port 44 on your iOS device by running

```shell
iproxy 2222 44
```

Now you can SSH into your device in a different terminal tab or window using

```shell
ssh -p 2222 root@localhost
```

The password is "alpine". Once you're in, run

```shell
cat > /private/var/containers/Shared/SystemGroup/systemgroup.com.apple.configurationprofiles/Library/ConfigurationProfiles/CloudConfigurationDetails.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>CloudConfigurationUIComplete</key>
		<true/>
		<key>ConfigurationWasApplied</key>
		<true/>
		<key>PostSetupProfileWasInstalled</key>
		<true/>
	</dict>
</plist>
EOF
```

This writes a certain configuration file to your device that seems to trick it into thinking that it
has already performed MDM enrollment during setup. Finally, [respring][9] the device by running

```shell
killall -9 SpringBoard
```

You should now be able to set up the device without going through MDM enrollment.

Sources:

- https://gist.github.com/FrankSpierings/a5f6c0b8ae640bfa9909a396e1ceb03c

[1]: https://checkra.in
[2]: https://support.apple.com/en-us/HT201252
[3]: https://www.apple.com/mac/
[4]: https://brew.sh
[5]: https://en.wikipedia.org/wiki/SSH_(Secure_Shell)
[6]: https://github.com/tcurdt/iProxy
[7]: https://libimobiledevice.org
[8]: https://en.wikipedia.org/wiki/Transmission_Control_Protocol
[9]: https://www.theiphonewiki.com/wiki/Respring
