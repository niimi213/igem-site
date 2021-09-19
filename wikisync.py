from igem_wikisync import wikisync as sync
from igem_wikisync.logger import logger
import os
import sys
from hashlib import md5

def upload_html(html_files):
  for path in html_files.keys():
    file_object = html_files[path]
    path_str = str(file_object.path)
    ext = file_object.extension

    # open file
    try:
        with open(file_object.src_path, 'r') as file:
            contents = file.read()
    except Exception:
        message = f'Could not open/read {file_object.path}. Skipping.'
        # logger.error(message)
        continue  # FIXME Can this be improved?

    # parse and modify contents
    processed = sync.HTMLparser(
        config, file_object.path, '' + contents + '', upload_map)
    processed = processed.replace('{{', '</html>{{').replace('}}', '}}<html>')

    # calculate and store md5 hash of the modified contents
    build_hash = md5(processed.encode('utf-8')).hexdigest()

    if upload_map[ext][path_str]['md5'] == build_hash:
        message = f'Contents of {file_object.path} have been uploaded previously. Skipping.'
        logger.info(message)
    else:
        upload_map[ext][path_str]['md5'] = build_hash
        build_path = file_object.build_path
        try:
            # create directory if doesn't exist
            if not os.path.isdir(build_path.parent):
                os.makedirs(build_path.parent)
            # and write the processed contents
            with open(build_path, 'w', encoding='utf-8') as file:
                file.write(processed)
        except Exception:
            message = f"Couldn not write {str(file_object.build_path)}. Skipping."
            logger.error(message)
            continue
            # FIXME Can this be improved?

        # upload
        successful = sync.iGEM_upload_page(browser, processed, file_object.upload_URL)
        if not successful:
            message = f'Could not upload {str(file_object.path)}. Skipping.'
            logger.error(message)
            continue
            # FIXME Can this be improved?
        else:
            pass
            # counter[ext] += 1

config = {
    'team':      'UTokyo',
    'src_dir':   'public/',
    'build_dir': 'build/',
    'year': '2021',
    'silence_warnings': False,
    'poster_mode': False
}
build_dir = config['build_dir']

# * 2. Load or create upload_map
upload_map = sync.get_upload_map()

# * 3. Create build directory
if not os.path.isdir(build_dir):
    os.mkdir(build_dir)
    # ? error handling here?

# * 4. Get iGEM credentials from environment variables
credentials = {
    'username': os.environ.get('IGEM_USERNAME'),
    'password': os.environ.get('IGEM_PASSWORD')
}

# * 5. Load/create cookie file
browser, cookiejar = sync.get_browser_with_cookies()

# * 6. Login to iGEM
login = sync.iGEM_login(browser, credentials, config)
if not login:
    message = 'Failed to login.'
    # logger.critical(message)
    sys.exit(2)

# # * 7. Save cookies
# # TODO: check if this works, might not
# cookiejar.save()

# * 8. Cache files
files = sync.cache_files(upload_map, config)

# * 9. Upload all assets and create a map
uploaded_assets = sync.upload_and_write_assets(files['other'], browser, upload_map, config)

for path in files['html'].keys():
    html_file = files['html'][path]
    if html_file._upload_path.startswith('/template/'):
        upload_map['html'][str(path)]['link_URL'] =  f'''https://{config['year']}.igem.org/Template:{config['team']}{html_file._upload_path}'''
        files['html'][path]._upload_URL = f'''https://{config['year']}.igem.org/wiki/index.php?title=Template:{config['team']}{html_file._upload_path}&action=edit'''

# * 10. write upload map just in case
# things go wrong while dealing with code
sync.write_upload_map(upload_map)

# * 11. Build files and upload changed files
# UTokyo modification: only dealing with css and js files
uploaded_code = sync.build_and_upload({
  'html': {},
  'css': files['css'],
  'js': files['js']
}, browser, config, upload_map)

uploaded_code_html = upload_html(files['html'])



# * 12. Write final upload map
sync.write_upload_map(upload_map)

sync.print_summary(uploaded_assets, uploaded_code)

# sync.run(
#   team='UTokyo',
#   src_dir='public',      # folder where your wiki is stored
#   build_dir='build'     # folder where WikiSync will temporarily store your wiki before uploading
# )
