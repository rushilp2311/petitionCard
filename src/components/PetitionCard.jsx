import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CreateIcon from '@material-ui/icons/Create';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from './Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useSliderStyles = makeStyles({
  root: {
    width: 250,
    margin: 'auto',
  },
  input: {
    width: '100%',
  },
});

const StyledCard = withStyles({
  root: {},
})(Card);

let dropzone;

const PetitionCard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [arrayOfHashtags, addHashtag] = useState([]);
  const [signatures, setSignatures] = useState(500);
  const [media, setMedia] = useState([]);

  const [error, setError] = React.useState({
    title: false,
    description: false,
    media: false,
  });

  const slider = useSliderStyles();

  /**
   * Function to Delete created Hashtags
   * @param {HashTag} h
   */
  const handleDelete = h => () => {
    addHashtag(arrayOfHashtags =>
      arrayOfHashtags.filter(hashtag => hashtag !== h),
    );
  };

  /**
   * Function to create new hastags
   */
  const newHashtag = () => {
    if (arrayOfHashtags.length < 3) {
      addHashtag(arrayOfHashtags => arrayOfHashtags.concat(hashtag));
      setHashtag('');
    } else {
    }
  };

  /**
   * Dropzone Class to upload files to
   */
  useEffect(() => {
    dropzone = new window.Dropzone('form', {
      url: 'http://localhost:3001/api/post/upload_file/',
      error: (file, msg, req) => {
        console.log('error file', file);
        let demo = [];
        demo.push(file);
        setMedia(demo);
        if (req?.status === 403) {
          window.alert(
            "You can't do that as a guest, please sign-up using the icon",
          );
        }
      },
      maxFiles: 4,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      acceptedFiles: 'image/jpeg, image/jpg, image/png, video/mp4',
      dictDefaultMessage: 'Click to attach Videos or Images',
      addRemoveLinks: true,
      maxFilesize: 10,
      success: (file, res) => {
        console.log('Success file', file);
        if (file.type.includes('image')) {
          media.push({
            location: res.location,
            type: 'image',
          });
        } else {
          media.push({
            location: res.location,
            type: 'video',
          });
        }
        setMedia([...media]);
      },
      removedfile: function (file) {
        media.splice(
          media.findIndex(e => e.location.includes(file.name)),
          1,
        );
        if (
          file.previewElement != null &&
          file.previewElement.parentNode != null
        ) {
          file.previewElement.parentNode.removeChild(file.previewElement);
        }
        return this._updateMaxFilesReachedClass();
      },
    });
    console.log(dropzone.getAcceptedFiles());
  }, [media]);

  /**
   * Function to submit the Petition form data.
   * @param {Event} event
   */
  const submitPetitionForm = event => {
    if (title.length > 5 && description.length > 5 && media.length > 0) {
      axios({
        url: `http://localhost:3001/api/petition_posts`,
        method: 'post',
        data: {
          title: title,
          description: description,
          hashtags: arrayOfHashtags.join(' '),
          goal: signatures,
          media: media,
        },
      })
        .then(() => {
          console.log("You've sucessfully created a petition");
        })
        .catch(error => {
          console.log('Error');
        });
      setTitle('');
      setDescription('');
      addHashtag([]);
      setHashtag('');
      setMedia([]);
      dropzone.removeAllFiles();
    } else {
      setError({
        title:
          title.length < 6
            ? 'A title must exist and at least 6 characters'
            : false,
        description:
          description.length < 6
            ? 'A description must exist and be at least 6 characters'
            : false,
        media:
          media.length === 0 ? 'A picture or video must be uploaded' : false,
      });

      console.log('The form submission was unsuccessful, see errors above');
    }
  };

  /**
   * Map function to create list of Hastags.
   */
  const Hashtags = arrayOfHashtags.map(h => (
    <Chip
      key={h.length}
      style={{ margin: 5 }}
      size='small'
      avatar={<Avatar>#</Avatar>}
      label={h}
      onDelete={handleDelete(h)}
    />
  ));

  return (
    <StyledCard>
      <div style={{ position: 'relative' }}>
        <Paper
          maxWidth='false'
          elevation={0}
          style={{
            padding: '40px 20px',
            borderRadius: '4px 4px 0px 0px',
            width: '100%',
            backgroundColor: '#27479f',
          }}>
          <div
            style={{ display: 'flex', marginLeft: 13, alignItems: 'center' }}>
            <IconButton>
              <ArrowBackIosIcon style={{ fill: 'white' }} />
            </IconButton>
            <Typography
              variant='h1'
              component='h1'
              style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontWeight: '400',
                fontSize: '30px',
              }}>
              Petition Information
            </Typography>
          </div>
          <Typography
            variant='h1'
            component='h2'
            style={{
              padding: 19,
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
            }}>
            Create a Petition for a purpose of your choice
          </Typography>
        </Paper>

        <Avatar
          style={{
            boxShadow: '0 0 0 4px #242525',
            backgroundColor: '#27479f',
            position: 'absolute',
            left: 20,
            bottom: -20,
          }}>
          <CreateIcon style={{ height: 25, width: 25, fill: 'white' }} />
        </Avatar>
      </div>

      <div
        style={{
          padding: 20,
          backgroundColor: '#242525',
          color: ' rgb(185, 185, 185)',
        }}>
        <Box mt={1}>
          <Grid container justify='center'>
            <TextField
              id='outlined-multiline-static'
              size='small'
              style={{ width: '100%' }}
              placeholder='Fight for Equality'
              label='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              error={error.title}
              helperText={error.title ? error.title : null}
              color='primary'
            />
          </Grid>
        </Box>

        <Box mt={1} justify='center'>
          <Grid container justify='center'>
            <TextField
              style={{ width: '100%' }}
              size='small'
              inputProps={{
                style: { fontSize: 15 },
              }}
              id='outlined-multiline-static'
              multiline
              rows={5}
              label={'Description'}
              placeholder="Here's an awesome description of a petition that you can sign to make a difference"
              value={description}
              onChange={e => setDescription(e.target.value)}
              error={error.description}
              helperText={error.description ? error.description : null}
            />
          </Grid>
        </Box>

        <Box mt={1} mb={1}>
          <TextField
            size='small'
            style={{ width: '100%' }}
            inputProps={{
              style: { fontSize: 15 },
            }}
            id='outlined-multiline-static'
            placeholder='SocialJustice'
            label='Hashtags'
            value={hashtag}
            error={arrayOfHashtags.length === 3}
            onChange={e => setHashtag(e.target.value)}
            helperText={
              arrayOfHashtags.length === 3
                ? 'You reached the maximum amount of hashtags'
                : ''
            }
          />

          <div style={{ marginTop: 20 }}>
            <Button
              label={'Create Hashtag'}
              fullWidth
              handleClick={newHashtag}
            />
          </div>
        </Box>

        {arrayOfHashtags.length > 0 ? Hashtags : ''}

        <Typography style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
          Goal Number of Signatures
        </Typography>
        <Box ml={2.65} mr={2.65}>
          <Grid container justify='center'>
            <Slider
              min={500}
              max={10000}
              step={500}
              marks
              //valueLabelDisplay="on"
              value={typeof signatures === 'number' ? signatures : 0}
              onChange={(event, newValue) => setSignatures(newValue)}
              aria-labelledby='input-slider'
            />
            <TextField
              className={slider.input}
              value={signatures}
              onChange={event =>
                setSignatures(
                  event.target.value === '' ? '' : Number(event.target.value),
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <CreateIcon />
                  </InputAdornment>
                ),
              }}
              helperText={
                signatures < 500 || signatures > 10000
                  ? 'Please enter a value between 500 and 10000'
                  : ''
              }
              error={signatures < 500 || signatures > 10000}
            />
          </Grid>
        </Box>

        <form
          class='dropzone'
          id='donationImageUpload'
          style={{
            margin: '20px 0',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}></form>
        {error.media ? <p style={{ color: 'red' }}>{error.media}</p> : null}

        <Box mt={1}>
          <Button
            label={'Create Petition'}
            fullWidth={true}
            handleClick={submitPetitionForm}
          />
        </Box>
      </div>
    </StyledCard>
  );
};

export default PetitionCard;
