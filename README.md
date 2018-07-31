# Work In Progress

This is a draft. Even if it weren't, you should still exercise extreme caution
before attempting anything you see here. Good day.

# Architecture

## How It Works

Everything starts from index.js, which reads tasks.yml to decide which tasks
(scripts) to run. This file checks for a 'tasks.yaml' file to define tasks in
the order they should be run. Each task defined in tasks.yaml maps to a script
inside tasks/. They should have the same name.

```shell
mkdev dotfiles # runs a script ./tasks/dotfiles with any file extension
```

A prep task is automatically run before each task to ensure dependencies are
installed and that the system is identified.

If you run `mkdev all` by itself, all tasks defined in tasks.yml for both 'light'
and 'full' will be run. `mkdev light` and `mkdev full` are also available.

To run a single task, you can append it after 'light' or 'full', or just pass it
after `mkdev` to run 'full'.

```shell
make dotfiles
make light packages
```

An individual task may or may not do things differently for 'light' vs.
'full'. Passing these options won't hurt anything if they don't end up being
used.

# Undoing

For any task, append `reset` to revert back (as much as possible).

```shell
make dotfiles reset
```

`mkdev reset` assumes it is to revert a 'full' install. If a light install was
done, the task will just try to remove some things that probably aren't there
and continue on.

If an original pre-install backup exists, it will be used. If no backup exists,
`mkdev reset` will try to revert to how things are configured on a stock system.

Also, an all-encompassing `mkdev reset` is available.

## Configuration

### Installers

All packages to be installed are stored in a packages.yml file.

Groups of packages are defined to provide options for a 'light' or 'full' or
partial install.

```yaml
system:
    light:
        - gcc
        - git
        - vim
        - tmux
    full:
        - fortune
        - pianobar
node:
    - js-yaml
    - standard
ruby:
    light:
        - bundler
        - rails
        - pry
    full:
        - lolcat
        - tmuxinator
```

You can also add even more nesting in the `system` list to account for packages
having different names across package managers.

```yaml
system:
    light:
      - git
      - gcc:
            brew: apple-gcc42
            yum: gcc
            apt: gcc
      - vim:
            brew: 'vim --with-features=huge --with-python3 --with-ruby --with-perl'
            dnf: vim-enhanced
      - tmux
    full:
        - fortune
        - pianobar
```

If the above configuration were to be used to `mkdev packages` on a system using,
say, `dnf`, as the package manager, `dnf install gcc` (the parent key) would be
attempted. If you really don't want a package to be installed on a certain
system, you can move it to an entirely new block for a specific package manager.

```shell
system:
  # ...
dnf:
    - gcc
    - xclip
brew:
    light:
        - chumkwm
        - khd
    full:
        - gcc-arm-none-eabi
```

Note that again, you can optionally define groups 'light' or 'full'.

This syntax is a bit awkward, yes. The idea is: There is only one place where I
have to add a package that I want installed. It's hard enough to remember to add
new software I want to keep around into another place after I already installed
it, so I don't want to have to navigate to multiple areas/files to add it.

# Tasks

Here are the current tasks available. Tasks without a check are not feature
complete.

- [ ] `install`
- [ ] `mkdev config` 
- [ ] `mkdev files` 
- [ ] `mkdev packages` 
- [ ] `mkdev ruby` 
- [ ] `mkdev node` 
- [ ] `mkdev python` 
- [ ] `mkdev apps` 
- [ ] `mkdev preferences` 
- [ ] `mkdev dotfiles` 
- [ ] `mkdev shell` 
- [ ] `mkdev cleanup` 
- [ ] `mkdev theme` 
- [ ] `mkdev ssh` 
- [ ] `mkdev gpg` 
- [ ] `mkdev 1password` 
- [ ] `mkdev chrome` 
- [ ] `mkdev extra` 

## `install`

This is a bash script. It is run first to get `mmkdev` set up.

1. Configure node/NPM and install self dependencies if not.
2. Determine which type of system this is and cache that somewhere.
3. Run `mkdev config`
4. Check for flag that file sync is ready. If not, confirm with user before
5. Check available disk space, confirm with user before proceeding if not a lot.
   proceeding.
6. Check available disk space, confirm with user before proceeding if not a lot.

## `mkdev config`

1. Check for existing config
  - If it exists, validate it.
  - If it doesn't, prompt for input.
2. Check for a valid package config and validate.

## `mkdev files`

This will likely be the component requiring the most customization. I use Google
Drive, so that is the default. Also, I use [InSync] as a Drive client for Linux.
Sadly, InSync is paid software and Google don't make a client for Linux like
Dropbox do. So the default setup is Google Drive on macOS and InSync on Linux,
however 'dropbox' (highly recommended for cross-platformers) and 'manual' sync
are also supported.  Set it in config.yml.

```yaml
files: dropbox
```

If `files` is 'manual', a prompt will ask if all files are ready. Once
confirmed, the system will assume that all assets are ready. If assets are
missing, tasks like `mkdev dotfiles` ([mackup]) will **likely fail pretty hard**.

This task will install and open the file synchronization method chosen and then
wait for console input confirming that files are ready. Once complete, if there
are other tasks in the queue they will begin.

## `mkdev packages`

1. determine package manager to use (`uname`)
2. install said package manager if not available
2. set up taps/sources
3. packages

Packages are stored as YAML lists in 'packages.yml'. Each package will have keys
for what its name is on different package managers. If a name is missing, don't
install it.  If `true` is listed, assume the name is the same across package
managers. See the [Configuration](#installers) section for more details.

## `mkdev ruby`

1. Ensure latest stable ruby is installed
2. Configure rbenv
3. Configure `gem`
4. Install gems

## `mkdev node`

1. Ensure latest stable node is installed
2. Configure NPM
3. Install global packages

## `mkdev python`

1. Ensure latest stable python is installed
2. Configure pip
3. Install global packages

## `mkdev apps`

This will install GUI-type applications. This is separate form `mkdev packages`
mostly because of `brew` keeping a separate `cask` abstraction. For Linux this
will simply pass the values to the same package manager used in `mkdev packages`.

```yaml
apps:
    chromium:
        cask: google-chrome
    docker:
        dnf: docker-ce
cask:
  - google-drive
  - iterm2
  - karabiner-elements
```

Above, 'google-chrome' would be passed to `brew cask install` while `chromium`
would be passed to any other package manager. 'google-drive', 'iterm2', and
'karabiner-elements' would only be installed on a system with `brew cask`. Note
that you could be tricky like:

```yaml
apps:
  terminal:
    cask: iterm2
    dnf: urxvt
    apt: terminator
```

On another system, like Arch, `pacman -S terminal` would be attempted. If there
is an error, it will be logged and brought to your attention post-haste.

## `mkdev preferences`

1. Do non-`defaults` prefs from a bash script or something
2. Set up everything for clintmod/formulas/macprefs
3. Import prefs using `macprefs`

## `mkdev dotfiles`

This could have sub routines, like per app or 'light' || 'full' install.

1. Back up any existing dotfiles just in case
    So `if ~/.thisfile, mv ~/.thisfile $CWD/backup`
2. Test for Mackup installed, install if !
3. Run Mackup restore
    - If error, give option to try again since Mackup is the literal definition
    of insanity.

## `mkdev shell`

1. install shell of choice
2. Set up extras like omf, ohmyzsh, or what have you
3. Set as default shell

## `mkdev cleanup`

Clean up system junk, like extra language files or bloatware like GNU
calculator.

## `mkdev theme`

Sets up your choice of [base16] color schemes, desktop wallpaper, and font(s).

## `mkdev ssh`

If ssh keys exist in dotfiles, import them. Otherwise, generate new keys with
the wizard.

## `mkdev gpg`

If ssh keys exist in dotfiles, import them. Otherwise, generate new keys with
the wizard.

## `mkdev 1password`

On macOS, install 1Password application. On macOS and Linux, open prompt for
which type of browser extensions to install (1Password mini or X) and open the
relevant pages in browser.

## `mkdev chrome`

Installs Chrome or Chromium, opens sign in page or copies local config if it
exists.

## `mkdev extra`

Any odds and/or ends you define will run here. Good for setting up things to
download, custom cron jobs, etc. Just edit the 'extra' file, make sure it's
executable, and it will run.

[base16]: https://github.com/chriskempson/base16/
[InSync]: https://www.insynchq.com/
[mackup]: https://github.com/lra/mackup/
