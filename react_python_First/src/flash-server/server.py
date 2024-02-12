import flask
import time
from flask import Flask, request, jsonify
# import wmi
# import pythoncom
import webbrowser
# import win32com.client as win32
# import subprocess
# import ipaddress
import requests
from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy, ProxyType

app = Flask(__name__)


def open_website(url):
    webbrowser.open(url,new=0, autoraise=True)

def change_ip_address(new_ip_address):
 try:
    command = f"netsh interface ip set address name='Realtek PCIe GBE Family Controller' static {new_ip_address} mask=255.255.254.0 gateway=192.168.106.254"
    subprocess.run(command, check=True, shell=True)
    return True  # IP address change successful
 except subprocess.CalledProcessError:
        return False  # IP address change faile

def change_proxy_server():

    proxy_url = '103.47.93.213'
    proxy_port = 1080
    
    proxies = {
        'http': f'http://{proxy_url}:{proxy_port}',
        'https': f'http://{proxy_url}:{proxy_port}'
    }
    
    # Update the proxy settings in your requests
    session = requests.Session()
    session.proxies.update(proxies)
    
    # Perform your requests using the updated proxy settings
    response = session.get('http://localhost:3000')
    print(response.text)

def open_with_proxy(url, proxy):
    try:
           # Configure the proxy settings
        proxy_settings = Proxy()
        proxy_settings.proxy_type = ProxyType.MANUAL
        proxy_settings.http_proxy = proxy['http']
        # proxy_settings.ssl_proxy = proxy['https']

        # Set up the web browser with the proxy
        browser_options = webdriver.ChromeOptions()
        browser_options.add_argument('--proxy-server=%s' % proxy['http'])
        # browser_options.add_argument('--proxy-server=%s' % proxy['https'])
        driver = webdriver.Chrome(options=browser_options)

        # Open the URL in the web browser
        driver.get(url)
         # Add a delay to wait for the webpage to fully load
        time.sleep(3600)  # Adjust the delay time as needed

        # Keep the browser open for a while before closing
        input("Press Enter to close the browser...")
        driver.quit()
        print("Done:")
        return jsonify({'message': 'IP address changed successfully'})

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return jsonify({'message': f"{str(e)}"}), 500


@app.route('/change_ip', methods=['POST'])
def change_ip():
   
    # interface_name = "Realtek PCIe GBE Family Controller"  
    # ip_address = request.json.get('ip_address')
    # subnet_mask = request.json.get('subnet_mask')
    # website_url = "https://www.primebpo.com"
    proxy_url=request.json.get('proxy_url')
    proxy_port=request.json.get('proxy_port')
    url=request.json.get('url')

    try:
        # change_ip_address(ip_address)
         # Initialize the COM system
        # pythoncom.CoInitialize()

        # wmi_obj = wmi.WMI()
        # adapter_config = wmi_obj.Win32_NetworkAdapterConfiguration(Description=interface_name)
        # if len(adapter_config) == 0:
        #     return jsonify({'message': f"No network adapter found with description: {interface_name}"}), 400

        # adapter = adapter_config[0]
        # adapter.EnableStatic(IPAddress=[ip_address], SubnetMask=[subnet_mask])
        # open_website(website_url)
        # google_ip = ipaddress.IPv4Network("8.8.8.8")
        # google_ip.address = ip_address
        # proxy_server = "10.0.0.1:8080"
        # change_proxy_server()
        proxies = {
                'http': f'http://{proxy_url}:{proxy_port}',
                # 'https': f'https://{proxy_url}:{proxy_port}'
            }
    

# verify=False,
        # response = requests.get("http://primebpo.com",proxies=proxies)
        # print(response.text)
        open_with_proxy(url, proxies)
        
        # return jsonify({'message': 'IP address changed successfully'})
        # open_website('https://primebpo.com/')

    except Exception as e:
        
        return jsonify({'message': f"{str(e)}"}), 500
        # if response.status_code == 500:

    
if __name__ == '__main__':
    app.run()