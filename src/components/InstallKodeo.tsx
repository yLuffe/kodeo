'use client';

import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Download } from 'lucide-react';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const base = process.env.NEXT_PUBLIC_KODEO_BASE_PATH ?? '';

export function InstallKodeo() {
  const [prompt, setPrompt] = useState<InstallPrompt>();
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const display = window.matchMedia('(display-mode: standalone)');
    function sync() {
      setInstalled(display.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    }
    function onPrompt(event: Event) { event.preventDefault(); setPrompt(event as InstallPrompt); }
    function onInstalled() { setInstalled(true); setPrompt(undefined); setHelp(false); }
    sync();
    display.addEventListener('change', sync);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {});
    }
    return () => {
      display.removeEventListener('change', sync);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) { setHelp(true); return; }
    setPrompt(undefined);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
    } catch { setHelp(true); }
  }

  if (installed) return null;
  return <>
    <Button className="install-kodeo" onClick={install} startIcon={<Download size={17}/>} aria-label="Instalar Kodeo">
      <span>Instalar<span className="install-kodeo-name"> Kodeo</span></span>
    </Button>
    <Dialog open={help} onClose={() => setHelp(false)} aria-labelledby="install-kodeo-title" fullWidth maxWidth="xs">
      <DialogTitle id="install-kodeo-title">Instalar Kodeo</DialogTitle>
      <DialogContent>
        <p>Abra o Kodeo pelo ícone na tela inicial ou na área de trabalho.</p>
        <ul className="install-steps">
          <li><strong>iPhone e iPad.</strong> No Safari, toque em Compartilhar e em Adicionar à Tela de Início.</li>
          <li><strong>Android.</strong> Abra o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.</li>
          <li><strong>Computador.</strong> Procure Instalar Kodeo na barra de endereço ou no menu do navegador.</li>
        </ul>
      </DialogContent>
      <DialogActions><Button onClick={() => setHelp(false)}>Entendi</Button></DialogActions>
    </Dialog>
  </>;
}
